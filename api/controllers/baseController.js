import { pool } from "../db/ConnectDb.js";
import cloudinary from "../utils/cloudinary.js";

const baseController = (tableName, idColumn, fields, imageField = null) => ({
  // Kiểm tra sự tồn tại của ID trong bảng
  checkExistenceById: async (id) => {
    const query = {
      text: `SELECT 1 FROM ${tableName} WHERE ${idColumn} = $1 LIMIT 1`,
      values: [id],
    };
    const result = await pool.query(query);
    return result.rowCount > 0; // Trả về true nếu tìm thấy, false nếu không
  },

  create: async (req, res) => {
    try {
      let imageUrl = null;

      // Nếu có hình ảnh, tiến hành upload lên Cloudinary
      if (imageField && req.file.path) {
        const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
          folder: `RestaurantManagementSystemApp/images/${tableName}`,
        });
        imageUrl = uploadResponse.secure_url;
      }

      // Tạo mảng giá trị từ req.body dựa trên các field
      const values = fields.map((field) => req.body[field]);

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
      const ans = await pool.query(query);

      if (ans.rowCount === 0) {
        return res
          .status(400)
          .json({ message: `Error in creating ${tableName}` });
      }

      const createdRow = ans.rows[0];

      // Nếu không có trường hình ảnh hoặc không upload được ảnh, xóa trường imageField
      if (imageField && !imageUrl) {
        delete createdRow[imageField];
      }

      res.status(200).json(createdRow);
    } catch (err) {
      res.status(500).json({ error: err.message });
      console.error(err);
    }
  },

  getById: async (req, res) => {
    try {
      const id = req.params.id;
      if (isNaN(id)) {
        return res
          .status(400)
          .json({ message: `Invalid ${tableName} ID. ID must be a number.` });
      }

      const query = {
        text: `SELECT * FROM ${tableName} WHERE ${idColumn} = $1`,
        values: [id],
      };
      const ans = await pool.query(query);

      if (ans.rows.length === 0) {
        return res.status(404).json({ message: `${tableName} not found` });
      }

      const resultRow = ans.rows[0];

      // Nếu không có giá trị cho trường hình ảnh, loại bỏ trường image_url
      if (imageField && !resultRow[imageField]) {
        delete resultRow[imageField];
      }

      res.status(200).json(resultRow);
    } catch (err) {
      res.status(500).json({ error: err.message });
      console.error(err);
    }
  },

  getAll: async (req, res) => {
    try {
      const query = { text: `SELECT * FROM ${tableName}` };
      const ans = await pool.query(query);

      if (ans.rows.length === 0) {
        return res.status(404).json({ message: `${tableName} not found` });
      }

      const resultRows = ans.rows.map((row) => {
        // Loại bỏ trường image_url nếu không có giá trị
        if (imageField && !row[imageField]) {
          delete row[imageField];
        }
        return row;
      });

      res.status(200).json(resultRows);
    } catch (err) {
      res.status(500).json({ error: err.message });
      console.error(err);
    }
  },

  updateById: async (req, res) => {
    try {
      const id = req.params.id;
      if (isNaN(id)) {
        return res
          .status(400)
          .json({ message: `Invalid ${tableName} ID. ID must be a number.` });
      }

      // Kiểm tra sự tồn tại của ID
      const exists = await baseController(
        tableName,
        idColumn,
        fields,
        imageField
      ).checkExistenceById(id);
      if (!exists) {
        return res.status(404).json({ message: `${tableName} not found` });
      }

      let imageUrl = null;

      // Nếu có hình ảnh mới, upload lên Cloudinary
      if (imageField && req.file.path) {
        const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
          folder: `RestaurantManagementSystemApp/images/${tableName}`,
        });
        imageUrl = uploadResponse.secure_url;
      }

      // Cập nhật các giá trị mới từ req.body
      const values = fields.map((field) => req.body[field]);

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

      const ans = await pool.query(query);

      if (ans.rowCount === 0) {
        return res
          .status(400)
          .json({ message: `Error in updating ${tableName}` });
      }

      const updatedRow = ans.rows[0];

      // Nếu không có giá trị cho imageField, loại bỏ trường image_url
      if (imageField && !updatedRow[imageField]) {
        delete updatedRow[imageField];
      }

      res.status(200).json(updatedRow);
    } catch (err) {
      res.status(500).json({ error: err.message });
      console.error(err);
    }
  },

  deleteById: async (req, res) => {
    try {
      const id = req.params.id;
      if (isNaN(id)) {
        return res
          .status(400)
          .json({ message: `Invalid ${tableName} ID. ID must be a number.` });
      }

      // Kiểm tra sự tồn tại của ID
      const exists = await baseController(
        tableName,
        idColumn,
        fields,
        imageField
      ).checkExistenceById(id);
      if (!exists) {
        return res.status(404).json({ message: `${tableName} not found` });
      }

      const query = {
        text: `DELETE FROM ${tableName} WHERE ${idColumn} = $1 RETURNING *`,
        values: [id],
      };

      const ans = await pool.query(query);

      if (ans.rowCount === 0) {
        return res.status(404).json({ message: `${tableName} not found` });
      }

      res.status(200).json({ message: `${tableName} deleted successfully` });
    } catch (err) {
      res.status(500).json({ error: err.message });
      console.error(err);
    }
  },
});

export default baseController;
