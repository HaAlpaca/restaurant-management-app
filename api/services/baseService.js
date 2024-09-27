import { pool } from "../config/db.js";
import cloudinary from "../config/cloudinary.js";

const baseService = (tableName, idColumn, fields, imageField = null) => ({
  // Kiểm tra sự tồn tại của ID trong bảng
  checkExistenceById: async (id) => {
    const query = {
      text: `SELECT 1 FROM ${tableName} WHERE ${idColumn} = $1 LIMIT 1`,
      values: [id],
    };
    const result = await pool.query(query);
    return result.rowCount > 0;
  },

  create: async (data, imagePath = null) => {
    let imageUrl = null;

    // Nếu có hình ảnh, tiến hành upload lên Cloudinary
    if (imageField && imagePath) {
      const uploadResponse = await cloudinary.uploader.upload(imagePath, {
        folder: `RestaurantManagementSystemApp/images/${tableName}`,
      });
      imageUrl = uploadResponse.secure_url;
    }

    // Tạo mảng giá trị từ dữ liệu dựa trên các field
    const values = fields.map((field) => data[field]);

    // Nếu có trường hình ảnh, chèn imageUrl vào đúng vị trí
    if (imageField && imageUrl) {
      values[fields.indexOf(imageField)] = imageUrl;
    }

    const query = {
      text: `INSERT INTO ${tableName}(${fields.join(", ")}) VALUES(${values
        .map((_, i) => `$${i + 1}`)
        .join(", ")}) RETURNING *`,
      values,
    };
    const result = await pool.query(query);
    return result.rows[0];
  },

  getById: async (id) => {
    const query = {
      text: `SELECT * FROM ${tableName} WHERE ${idColumn} = $1`,
      values: [id],
    };
    const result = await pool.query(query);
    return result.rows[0];
  },

  getAll: async () => {
    const query = { text: `SELECT * FROM ${tableName}` };
    const result = await pool.query(query);
    return result.rows;
  },

  updateById: async (id, data, imagePath = null) => {
    let imageUrl = null;

    // Nếu có hình ảnh mới, upload lên Cloudinary
    if (imageField && imagePath) {
      const uploadResponse = await cloudinary.uploader.upload(imagePath, {
        folder: `RestaurantManagementSystemApp/images/${tableName}`,
      });
      imageUrl = uploadResponse.secure_url;
    }

    // Cập nhật các giá trị mới từ dữ liệu
    const values = fields.map((field) => data[field]);

    // Nếu có trường hình ảnh và hình ảnh mới, cập nhật giá trị
    if (imageField && imageUrl) {
      values[fields.indexOf(imageField)] = imageUrl;
    }

    const setClause = fields
      .map((field, i) => `${field} = $${i + 1}`)
      .join(", ");

    const query = {
      text: `UPDATE ${tableName} SET ${setClause} WHERE ${idColumn} = $${
        fields.length + 1
      } RETURNING *`,
      values: [...values, id],
    };

    const result = await pool.query(query);
    return result.rows[0];
  },

  deleteById: async (id) => {
    const query = {
      text: `DELETE FROM ${tableName} WHERE ${idColumn} = $1 RETURNING *`,
      values: [id],
    };
    const result = await pool.query(query);
    return result.rows[0];
  },
});

export default baseService;
