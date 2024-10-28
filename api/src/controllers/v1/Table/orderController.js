import { StatusCodes } from "http-status-codes";
import { pool } from "../../../config/db.js";
import baseController from "./_baseController.js";

const Fields = ["reservations_id", "status", "description"];
const Controller = baseController("orders", "orders_id", Fields);

export const {
  create: createOrder,
  getById: getOrderById,
  getAll: getAllOrder,
  updateById: updateOrderById,
  deleteById: deleteOrderById,
} = Controller;

export const assignOrder = async (req, res, next) => {
  try {
    const { reservations_id, status = "Đang chờ", description = "" } = req.body;

    const reservationResult = await pool.query(
      "SELECT * FROM reservations WHERE reservations_id = $1 ",
      [reservations_id]
    );

    if (reservationResult.rows.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Reservation không tồn tại" });
    }
    // kiem tra order
    const existingOrderResult = await pool.query(
      "SELECT * FROM orders WHERE reservations_id = $1",
      [reservations_id]
    );

    if (existingOrderResult.rows.length > 0) {
      return res.status(StatusCodes.CONFLICT).json({
        message: "Reservation này đã được liên kết với một order khác",
      });
    }

    const assignResult = await pool.query(
      "INSERT INTO orders (reservations_id, status, description) VALUES ($1, $2, $3) RETURNING *",
      [reservations_id, status, description]
    );

    res.status(StatusCodes.CREATED).json(assignResult.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const getOrderByReservation = async (req, res, next) => {
  try {
    const { id } = req.params;

    const orderResult = await pool.query(
      "SELECT * FROM orders WHERE reservations_id = $1",
      [id]
    );

    if (orderResult.rows.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Order không tồn tại cho reservation này" });
    }

    res.status(StatusCodes.OK).json(orderResult.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reservations_id, status = "Đang chờ", description = "" } = req.body;

    // Kiểm tra nếu reservations_id không tồn tại trong req.body
    if (!reservations_id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "reservations_id là trường bắt buộc" });
    }

    // Kiểm tra xem order có tồn tại không
    const orderResult = await pool.query(
      "SELECT * FROM orders WHERE orders_id = $1",
      [id]
    );

    if (orderResult.rows.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Order không tồn tại" });
    }

    // Kiểm tra xem reservations_id có tồn tại không
    const reservationResult = await pool.query(
      "SELECT * FROM reservations WHERE reservations_id = $1",
      [reservations_id]
    );

    if (reservationResult.rows.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Reservation không tồn tại" });
    }

    // Kiểm tra xem reservations_id đã liên kết với order khác chưa
    const existingOrderResult = await pool.query(
      "SELECT * FROM orders WHERE reservations_id = $1 AND orders_id != $2",
      [reservations_id, id]
    );

    if (existingOrderResult.rows.length > 0) {
      return res.status(StatusCodes.CONFLICT).json({
        message: "Reservation này đã được liên kết với một order khác",
      });
    }

    // Cập nhật thông tin order
    const updatedOrderResult = await pool.query(
      "UPDATE orders SET reservations_id = $1, status = $2, description = $3 WHERE orders_id = $4 RETURNING *",
      [reservations_id, status, description, id]
    );

    res.status(StatusCodes.OK).json(updatedOrderResult.rows[0]);
  } catch (error) {
    next(error);
  }
};
