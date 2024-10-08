import { pool } from "../../../config/db.js";
import {
  filterAndSortItemsByOrder,
  filterAndSortOrdersByItem,
} from "../../../services/orderitemService.js";

// Hàm thêm nhiều quan hệ giữa items và orders
const addOrdersItems = async (req, res) => {
  const { data } = req.body; // Lấy mảng data từ body

  try {
    // Kiểm tra nếu không có dữ liệu
    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ message: "Missing items data" });
    }

    const addedItemsOrders = []; // Mảng lưu trữ các bản ghi vừa được thêm

    // Duyệt qua từng đối tượng trong mảng data
    for (const { itemId, orderId, quantity, description } of data) {
      // Kiểm tra nếu không đủ thông tin
      if (!itemId || !orderId || !quantity) {
        return res
          .status(400)
          .json({ message: "Missing itemId, orderId, or quantity" });
      }

      // Thêm quan hệ vào bảng orders_items
      const result = await pool.query(
        `INSERT INTO orders_items (items_id, orders_id, quantity, description) 
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [itemId, orderId, quantity, description || null]
      );

      addedItemsOrders.push(result.rows[0]); // Thêm bản ghi vừa thêm vào mảng
    }

    res.status(201).json({
      message: "Items added to orders successfully",
      addedItemsOrders, // Trả về danh sách các bản ghi đã thêm
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Hàm xử lý lấy danh sách các mục theo đơn hàng
const getItemsByOrder = async (req, res) => {
  const orderId = req.params.id;
  const filter = req.query.filter || ""; // Lấy giá trị filter từ query params
  const sort = req.query.sort || "asc"; // Lấy giá trị sort (mặc định là "asc")

  try {
    const items = await filterAndSortItemsByOrder(pool, orderId, filter, sort);

    res.status(200).json({
      orderId: orderId,
      items: items, // Danh sách các mục liên quan đến đơn hàng
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Hàm xử lý lấy danh sách các đơn hàng theo mục
const getOrdersByItem = async (req, res) => {
  const itemId = req.params.id;
  const filter = req.query.filter || ""; // Lấy giá trị filter từ query params
  const sort = req.query.sort || "asc"; // Lấy giá trị sort (mặc định là "asc")

  try {
    const orders = await filterAndSortOrdersByItem(pool, itemId, filter, sort);
    res.status(200).json({
      itemId: itemId,
      orders: orders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteOrderFromItems = async (req, res) => {
  const { id } = req.params; // Không cần `.id` vì `id` là một phần của params

  try {
    // Kiểm tra nếu không đủ thông tin
    if (!id) {
      return res.status(400).json({ message: "Missing orderId" });
    }

    // Xóa từ bảng orders_items
    const result = await pool.query(
      "DELETE FROM orders_items WHERE orders_id = $1 RETURNING *",
      [id]
    );

    // Kiểm tra xem bản ghi có tồn tại không
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "No items found for the given orderId" });
    }

    // Nếu thành công
    res.status(200).json({
      message: "Successfully removed order items",
      deletedRecords: result.rows, // Trả về các bản ghi đã xóa
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  addOrdersItems,
  getItemsByOrder,
  getOrdersByItem,
  deleteOrderFromItems,
};
