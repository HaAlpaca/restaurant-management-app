import { pool } from "../db/ConnectDb.js";

const baseController = (tableName, idColumn, fields) => ({
  // Kiểm tra sự tồn tại của ID trong bảng
  checkExistenceById: async (id) => {
    const query = {
      text: `SELECT 1 FROM ${tableName} WHERE ${idColumn} = $1 LIMIT 1`,
      values: [id],
    };
    const result = await pool.query(query);
    return result.rowCount > 0;  // Trả về true nếu tìm thấy, false nếu không
  },

  create: async (req, res) => {
    try {
      const values = fields.map(field => req.body[field]);
      const query = {
        text: `INSERT INTO ${tableName}(${fields.join(", ")}) VALUES(${values.map((_, i) => `$${i + 1}`).join(", ")}) RETURNING *`,
        values,
      };
      const ans = await pool.query(query);

      if (ans.rowCount === 0) {
        return res.status(400).json({ message: `Error in creating ${tableName}` });
      }

      res.status(200).json(ans.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
      console.error(err);
    }
  },

  getById: async (req, res) => {
    try {
      const id = req.params.id;
      if (isNaN(id)) {
        return res.status(400).json({ message: `Invalid ${tableName} ID. ID must be a number.` });
      }

      const query = {
        text: `SELECT * FROM ${tableName} WHERE ${idColumn} = $1`,
        values: [id],
      };
      const ans = await pool.query(query);

      if (ans.rows.length === 0) {
        return res.status(404).json({ message: `${tableName} not found` });
      }

      res.status(200).json(ans.rows[0]);
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

      res.status(200).json(ans.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
      console.error(err);
    }
  },

  updateById: async (req, res) => {
    try {
      const id = req.params.id;
      if (isNaN(id)) {
        return res.status(400).json({ message: `Invalid ${tableName} ID. ID must be a number.` });
      }

      // Kiểm tra sự tồn tại của ID
      const exists = await baseController(tableName, idColumn, fields).checkExistenceById(id);
      if (!exists) {
        return res.status(404).json({ message: `${tableName} not found` });
      }

      const values = fields.map(field => req.body[field]);
      const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(", ");

      const query = {
        text: `UPDATE ${tableName} SET ${setClause} WHERE ${idColumn} = $${fields.length + 1} RETURNING *`,
        values: [...values, id],
      };

      const ans = await pool.query(query);

      if (ans.rowCount === 0) {
        return res.status(400).json({ message: `Error in updating ${tableName}` });
      }

      res.status(200).json(ans.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
      console.error(err);
    }
  },

  deleteById: async (req, res) => {
    try {
      const id = req.params.id;
      if (isNaN(id)) {
        return res.status(400).json({ message: `Invalid ${tableName} ID. ID must be a number.` });
      }

      // Kiểm tra sự tồn tại của ID
      const exists = await baseController(tableName, idColumn, fields).checkExistenceById(id);
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
