import { StatusCodes } from "http-status-codes";
import { pool } from "../../../config/db.js";
import baseController from "./_baseController.js";
const Fields = ["name", "image_url", "unit", "category", "price"];
const Controller = baseController("items", "items_id", Fields, "image_url");
// Item

export const getAllItemStatus = async (req, res, next) => {
  try {
    const query = `
    SELECT 
    i.*,  -- Lấy tất cả thông tin của từng sản phẩm (item)
    CASE 
        WHEN COUNT(CASE WHEN pi.quantity > p.quantity THEN 1 END) > 0 THEN 'Không đủ hàng tồn'
        ELSE 'Có thể sản xuất'
    END AS item_status -- Trạng thái cho biết có đủ nguyên liệu hay không
    FROM Products p
    JOIN Products_Items pi ON p.products_id = pi.products_id
    JOIN Items i ON pi.items_id = i.items_id
    GROUP BY i.items_id, i.name, i.image_url, i.unit, i.category, i.price, i.created_at, i.updated_at;
    `;
    const result = await pool.query(query);
    res.status(StatusCodes.OK).json(result.rows);
  } catch (error) {
    next(error);
  }
};

export const {
  create: createItem,
  getById: getItemById,
  getAll: getAllItem,
  updateById: updateItemById,
  deleteById: deleteItemById,
} = Controller;
