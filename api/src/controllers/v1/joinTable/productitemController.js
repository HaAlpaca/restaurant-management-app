import { pool } from "../../../config/db.js";
import { StatusCodes } from "http-status-codes"; // Sử dụng mã trạng thái HTTP chuẩn

// Hàm thêm quan hệ giữa sản phẩm và mục
const addProductItem = async (req, res) => {
  const { data } = req.body; // Lấy mảng data từ body

  try {
    // Kiểm tra nếu không có dữ liệu
    if (!Array.isArray(data) || data.length === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Missing items data" });
    }

    const addedProductsItems = []; // Mảng lưu trữ các bản ghi vừa được thêm

    // Duyệt qua từng đối tượng trong mảng data
    for (const { productId, itemId, quantity_used } of data) {
      // Kiểm tra nếu không đủ thông tin
      if (!productId || !itemId || quantity_used === undefined) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Missing productId, itemId, or quantity_used" });
      }

      // Thêm quan hệ vào bảng Products_Items
      const result = await pool.query(
        `INSERT INTO Products_Items (products_id, items_id, quantity_used) 
         VALUES ($1, $2, $3) RETURNING *`,
        [productId, itemId, quantity_used]
      );

      addedProductsItems.push(result.rows[0]); // Thêm bản ghi vừa thêm vào mảng
    }

    res.status(StatusCodes.CREATED).json(addedProductsItems); // Trả về danh sách các bản ghi đã thêm
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

// Hàm lấy danh sách các mục theo sản phẩm
const getItemsByProduct = async (req, res) => {
  const productId = req.params.id;

  try {
    const result = await pool.query(
      `SELECT i.items_id, i.name, pi.quantity_used
       FROM Products_Items pi
       JOIN Items i ON pi.items_id = i.items_id
       WHERE pi.products_id = $1`,
      [productId]
    );

    res.status(StatusCodes.OK).json({
      productId: productId,
      items: result.rows, // Danh sách các mục liên quan đến sản phẩm
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

// Hàm lấy danh sách các sản phẩm theo mục
const getProductsByItem = async (req, res) => {
  const itemId = req.params.id;

  try {
    const result = await pool.query(
      `SELECT p.products_id, p.name, pi.quantity_used
       FROM Products_Items pi
       JOIN Products p ON pi.products_id = p.products_id
       WHERE pi.items_id = $1`,
      [itemId]
    );

    res.status(StatusCodes.OK).json({
      itemId: itemId,
      products: result.rows, // Danh sách các sản phẩm liên quan đến mục
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

// Hàm xóa sản phẩm khỏi mục
const deleteProductItem = async (req, res) => {
  const { id } = req.params; // ID của mối quan hệ giữa sản phẩm và mục

  try {
    // Kiểm tra nếu không có ID
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Missing product item relation ID" });
    }

    // Xóa từ bảng Products_Items
    const result = await pool.query(
      "DELETE FROM Products_Items WHERE products_id = $1 RETURNING *",
      [id]
    );

    // Kiểm tra xem bản ghi có tồn tại không
    if (result.rowCount === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "No product item relation found for the given ID" });
    }

    // Nếu thành công
    res.status(StatusCodes.OK).json(result.rows[0]); // Trả về bản ghi đã xóa
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export {
  addProductItem,
  getItemsByProduct,
  getProductsByItem,
  deleteProductItem,
};
