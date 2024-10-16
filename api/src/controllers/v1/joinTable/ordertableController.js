import { pool } from "../../../config/db.js";

import { StatusCodes } from "http-status-codes";
import { filterOrdersByTable, filterTablesByOrder } from "../../../services/v1/ordertableService.js";

// Hàm xử lý lấy danh sách các bàn theo đơn hàng
const getTablesByOrder = async (req, res) => {
  const orderId = req.params.id;
  const filter = req.query.filter || ""; // Lấy giá trị filter từ query params
  const sort = req.query.sort || "asc"; // Lấy giá trị sort (mặc định là "asc")

  try {
    // Truy vấn để lấy thông tin về đơn hàng
    const orderResult = await pool.query(
      `SELECT *
         FROM orders o 
         WHERE o.orders_id = $1`,
      [orderId]
    );

    // Kiểm tra nếu không tìm thấy đơn hàng
    if (orderResult.rows.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Order not found" });
    }

    // Gọi hàm filter từ service để lấy danh sách các bàn liên quan đến đơn hàng
    const tables = await filterTablesByOrder(pool, orderId, filter, sort);

    // Trả về dữ liệu bao gồm cả thông tin đơn hàng và danh sách các bàn
    res.status(StatusCodes.OK).json({
      ...orderResult.rows[0],
      tables: tables, // Danh sách các bàn liên quan đến đơn hàng
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

// Hàm xử lý lấy danh sách các đơn hàng theo bàn
const getOrdersByTable = async (req, res) => {
  const tableId = req.params.id;
  const filter = req.query.filter || ""; // Lấy giá trị filter từ query params (mặc định là rỗng nếu không có)
  const sort = req.query.sort || "asc"; // Lấy giá trị sort (mặc định là "asc")

  try {
    // Truy vấn để lấy thông tin về bàn
    const tableResult = await pool.query(
      `SELECT t.*
         FROM tables t 
         WHERE t.tables_id = $1`,
      [tableId]
    );

    // Kiểm tra nếu không tìm thấy bàn
    if (tableResult.rows.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Table not found" });
    }

    // Gọi hàm filter từ service để lấy danh sách các đơn hàng liên quan đến bàn
    const orders = await filterOrdersByTable(pool, tableId, filter, sort);

    // Trả về dữ liệu bao gồm cả thông tin bàn và danh sách các đơn hàng
    res.status(StatusCodes.OK).json({
      ...tableResult.rows[0],
      orders: orders, // Danh sách các đơn hàng liên quan đến bàn
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

// Hàm thêm quan hệ giữa đơn hàng và bàn
const add = async (req, res) => {
  const { orders_id, tables_id } = req.body;

  try {
    // Kiểm tra nếu không đủ thông tin
    if (!orders_id || !tables_id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Missing order or table ID" });
    }

    // Thêm mối quan hệ giữa order và table
    const result = await pool.query(
      "INSERT INTO orders_tables (orders_id, tables_id) VALUES ($1, $2) RETURNING *",
      [orders_id, tables_id]
    );

    // Lấy thông tin chi tiết của order
    const orderDetails = await pool.query(
      "SELECT * FROM orders WHERE orders_id = $1",
      [orders_id]
    );

    // Lấy thông tin chi tiết của table
    const tableDetails = await pool.query(
      "SELECT * FROM tables WHERE tables_id = $1",
      [tables_id]
    );

    res.status(StatusCodes.CREATED).json({
      message: "Table added to order successfully",
      table: tableDetails.rows[0],
      order: orderDetails.rows[0],
      relation: result.rows[0], // Quan hệ vừa được tạo
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

// Hàm xóa quan hệ giữa đơn hàng và bàn
const remove = async (req, res) => {
  const { orders_id, tables_id } = req.body;

  try {
    // Kiểm tra nếu không đủ thông tin
    if (!orders_id || !tables_id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Missing order or table ID" });
    }

    // Xóa mối quan hệ giữa order và table
    const result = await pool.query(
      "DELETE FROM orders_tables WHERE orders_id = $1 AND tables_id = $2",
      [orders_id, tables_id]
    );

    if (result.rowCount === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Order or table not found" });
    }

    res
      .status(StatusCodes.OK)
      .json({ message: "Table removed from order successfully" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const getall = async (req, res) => {
  try {
    // Truy vấn để lấy thông tin về bàn
    const result = await pool.query(
      `SELECT *
         FROM orders_tables
      `
    );
    res.status(StatusCodes.OK).json(result.rows);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export { getTablesByOrder, getOrdersByTable, add, remove, getall };
