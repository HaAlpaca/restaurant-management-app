import { pool } from "../../../config/db.js";
import {
  filterAndSortItemsByOrder,
  filterAndSortOrdersByItem,
} from "../../../services/v1/orderitemService.js";
import { StatusCodes } from "http-status-codes";
// Hàm thêm nhiều quan hệ giữa items và orders
const addOrdersItems = async (req, res, next) => {
  const items = req.body; // Lấy mảng trực tiếp từ body

  try {
    // Kiểm tra nếu không có dữ liệu
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json("Missing type array in req.body");
    }

    // Kiểm tra tất cả các items trong mảng trước khi tiến hành thêm
    for (const { items_id, orders_id, quantity } of items) {
      // Kiểm tra nếu không đủ thông tin
      if (!items_id || !orders_id || !quantity) {
        return res.status(400).json("Missing items_id or orders_id or quantity");
      }

      // Kiểm tra items_id có tồn tại không
      const itemExists = await pool.query(
        `SELECT 1 FROM Items WHERE items_id = $1`,
        [items_id]
      );
      if (itemExists.rowCount === 0) {
        return res.status(400).json(`Items_id ${items_id} does not exist`);
      }

      // Kiểm tra orders_id có tồn tại không
      const orderExists = await pool.query(
        `SELECT 1 FROM Orders WHERE orders_id = $1`,
        [orders_id]
      );
      if (orderExists.rowCount === 0) {
        return res.status(400).json(`Orders_id ${orders_id} does not exist`);
      }
    }

    // Nếu tất cả kiểm tra đều hợp lệ, bắt đầu thêm vào cơ sở dữ liệu
    const addedItemsOrders = [];
    for (const { items_id, orders_id, quantity } of items) {
      // Thêm quan hệ vào bảng orders_items
      const result = await pool.query(
        `INSERT INTO orders_items (items_id, orders_id, quantity) 
         VALUES ($1, $2, $3) RETURNING *`,
        [items_id, orders_id, quantity]
      );

      addedItemsOrders.push(result.rows[0]); // Thêm bản ghi vừa thêm vào mảng
    }

    res.status(201).json(addedItemsOrders);
  } catch (error) {
    next(error);
  }
};


// Hàm xử lý lấy danh sách các mục theo đơn hàng
const getItemsByOrder = async (req, res) => {
  const orderId = req.params.id;
  const filter = req.query.filter || ""; // Lấy giá trị filter từ query params
  const sort = req.query.sort || "asc"; // Lấy giá trị sort (mặc định là "asc")

  try {
    // Truy vấn để lấy thông tin về bàn
    const orderResult = await pool.query(
      `SELECT o.*
             FROM orders o 
             WHERE o.orders_id = $1`,
      [orderId]
    );
    console.log(orderResult);

    // Kiểm tra nếu không tìm thấy bàn
    if (orderResult.rows.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Order not found" });
    }
    const items = await filterAndSortItemsByOrder(pool, orderId, filter, sort);

    res.status(200).json({
      ...orderResult.rows[0],
      items: items, // Danh sách các mục liên quan đến đơn hàng
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

// Hàm xử lý lấy danh sách các đơn hàng theo mục
const getOrdersByItem = async (req, res) => {
  const itemId = req.params.id;
  const filter = req.query.filter || ""; // Lấy giá trị filter từ query params
  const sort = req.query.sort || "asc"; // Lấy giá trị sort (mặc định là "asc")

  try {
    // Truy vấn để lấy thông tin về bàn
    const itemResult = await pool.query(
      `SELECT i.* FROM items i WHERE i.items_id = $1`,
      [itemId]
    );

    // Kiểm tra nếu không tìm thấy bàn
    if (itemResult.rows.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Order not found" });
    }
    const orders = await filterAndSortOrdersByItem(pool, itemId, filter, sort);
    res.status(200).json({
      ...itemResult.rows[0],
      orders: orders,
    });
  } catch (error) {
    res.status(500).json();
  }
};

const getall = async (req, res) => {
  try {
    // Truy vấn để lấy thông tin về bàn
    const result = await pool.query(
      `SELECT * FROM orders_items
      `
    );
    res.status(StatusCodes.OK).json(result.rows);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const deleteOrdersItems = async (req, res) => {
  const { items_id, orders_id } = req.query; // Lấy items_id và orders_id từ query string

  try {
    // Kiểm tra nếu không có đủ thông tin
    if (!items_id || !orders_id) {
      return res.status(400).json({ message: "Missing items_id or orders_id" });
    }

    // Kiểm tra xem bản ghi có tồn tại không
    const checkExist = await pool.query(
      `SELECT * FROM orders_items WHERE items_id = $1 AND orders_id = $2`,
      [items_id, orders_id]
    );

    if (checkExist.rowCount === 0) {
      return res.status(404).json({ message: "Order item not found" });
    }

    // Xóa bản ghi nếu tồn tại
    const result = await pool.query(
      `DELETE FROM orders_items 
       WHERE items_id = $1 AND orders_id = $2 
       RETURNING *`,
      [items_id, orders_id]
    );

    res.status(200).json({
      message: "Delete successfully",
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export {
  addOrdersItems,
  getItemsByOrder,
  getOrdersByItem,
  deleteOrdersItems,
  getall,
};
