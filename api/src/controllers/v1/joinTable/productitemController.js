import { pool } from "../../../config/db.js";
import { StatusCodes } from "http-status-codes";
import {
  filterAndSortItemsByProduct,
  filterAndSortProductsByItem,
} from "../../../services/v1/productitemService.js";

// Hàm thêm quan hệ giữa sản phẩm và mục
const addProductItem = async (req, res) => {
  const items = req.body; // Lấy mảng trực tiếp từ body

  try {
    // Kiểm tra nếu không có dữ liệu
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json();
    }

    const addedProductsItems = []; // Mảng lưu trữ các bản ghi vừa được thêm

    // Duyệt qua từng đối tượng trong mảng
    for (const { products_id, items_id, quantity } of items) {
      // Kiểm tra nếu không đủ thông tin
      if (!products_id || !items_id || !quantity) {
        return res.status(400).json();
      }

      // Thêm quan hệ vào bảng Products_Items
      const result = await pool.query(
        `INSERT INTO Products_Items (products_id, items_id, quantity) 
         VALUES ($1, $2, $3) RETURNING *`,
        [products_id, items_id, quantity]
      );

      addedProductsItems.push(result.rows[0]); // Thêm bản ghi vừa thêm vào mảng
    }

    res.status(201).json(addedProductsItems);
  } catch (error) {
    res.status(500).json();
  }
};

// Hàm lấy danh sách các mục theo sản phẩm
const getItemsByProduct = async (req, res) => {
  const productId = req.params.id;
  const filter = req.query.filter || ""; // Lấy giá trị filter từ query params
  const sort = req.query.sort || "asc"; // Lấy giá trị sort (mặc định là "asc")

  try {
    const productResult = await pool.query(
      `SELECT p.* FROM Products p WHERE p.products_id = $1`,
      [productId]
    );

    if (productResult.rows.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Product not found" });
    }

    const items = await filterAndSortItemsByProduct(
      pool,
      productId,
      filter,
      sort
    );

    res.status(200).json({
      ...productResult.rows[0],
      items: items, // Danh sách các mục liên quan đến sản phẩm
    });
  } catch (error) {
    res.status(500).json();
  }
};

// Hàm lấy danh sách các sản phẩm theo mục
const getProductsByItem = async (req, res) => {
  const itemId = req.params.id;
  const filter = req.query.filter || ""; // Lấy giá trị filter từ query params
  const sort = req.query.sort || "asc"; // Lấy giá trị sort (mặc định là "asc")

  try {
    const itemResult = await pool.query(
      `SELECT i.* FROM Items i WHERE i.items_id = $1`,
      [itemId]
    );

    if (itemResult.rows.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Item not found" });
    }

    const products = await filterAndSortProductsByItem(
      pool,
      itemId,
      filter,
      sort
    );

    res.status(200).json({
      ...itemResult.rows[0],
      products: products, // Danh sách các sản phẩm liên quan đến mục
    });
  } catch (error) {
    res.status(500).json();
  }
};

const deleteProductItem = async (req, res) => {
  const { products_id, items_id } = req.query; // Lấy products_id và items_id từ query string

  try {
    // Kiểm tra nếu không có đủ thông tin
    if (!products_id || !items_id) {
      return res
        .status(400)
        .json({ message: "Missing products_id or items_id" });
    }

    // Kiểm tra xem bản ghi có tồn tại không
    const checkExist = await pool.query(
      `SELECT * FROM Products_Items WHERE products_id = $1 AND items_id = $2`,
      [products_id, items_id]
    );

    if (checkExist.rowCount === 0) {
      return res.status(404).json({ message: "Product item not found" });
    }

    // Xóa bản ghi nếu tồn tại
    const result = await pool.query(
      `DELETE FROM Products_Items 
       WHERE products_id = $1 AND items_id = $2 
       RETURNING *`,
      [products_id, items_id]
    );

    res.status(200).json({
      message: "Delete successfully",
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const getall = async (req, res) => {
  try {
    // Truy vấn để lấy thông tin về bàn
    const result = await pool.query(
      `SELECT * FROM Products_Items
      `
    );
    res.status(StatusCodes.OK).json(result.rows);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export {
  addProductItem,
  getItemsByProduct,
  getProductsByItem,
  deleteProductItem,
  getall,
};
