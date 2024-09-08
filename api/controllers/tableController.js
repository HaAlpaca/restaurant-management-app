import { pool, client } from "../db/ConnectDb.js";
import {
  deleteIdQuery,
  insertQuery,
  selectAllQuery,
  selectIdQuery,
  updateQuery,
} from "../utils/queryParams.js";

const createTable = async (req, res) => {
  try {
    const { name, quantity, location, status } = req.body;

    const query = insertQuery(
      "tables",
      ["name", "quantity", "location", "status"],
      [name, quantity, location, status]
    );
    const ans = await pool.query(query);

    if (ans.rowCount === 0) {
      res.status(400).json({ message: "Error in creating table" });
    } else {
      //return new
      const newTable = ans.rows[0];
      res.status(200).json(newTable);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

const getTableById = async (req, res) => {
  try {
    const id = req.params.id;
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ message: "Invalid table ID. ID must be a number." });
    }

    const query = selectIdQuery("tables_id", id, "tables");
    const ans = await pool.query(query);

    if (ans.rows.length === 0) {
      return res.status(404).json({ message: "table not found" });
    }
    const table = ans.rows[0];
    res.status(200).json(table);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.error(err);
  }
};
const getAllTable = async (req, res) => {
  try {
    const query = selectAllQuery("tables");

    const ans = await pool.query(query);

    if (ans.rows.length === 0) {
      return res.status(404).json({ message: "table not found" });
    }
    const table = ans.rows;
    res.status(200).json(table);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

const deleteTableById = async (req, res) => {
  try {
    const id = req.params.id;
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ message: "Invalid table ID. ID must be a number." });
    }
    const query = selectIdQuery("tables_id", id, "tables");

    const ans = await pool.query(query);

    if (ans.rows.length === 0) {
      return res.status(404).json({ message: "table not found" });
    }

    const query2 = deleteIdQuery("tables_id", id, "tables");

    const ans2 = await pool.query(query2);

    if (ans2.rowCount === 0) {
      return res.status(404).json({ message: "Table not found" });
    }

    res.status(200).json({ message: "Table deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

const updateTableById = async (req, res) => {
  try {
    const { name, quantity, location, status } = req.body;

    const id = req.params.id;
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ message: "Invalid table ID. ID must be a number." });
    }

    const query = selectIdQuery("tables_id", id, "tables");

    const ans = await pool.query(query);

    if (ans.rows.length === 0) {
      return res.status(404).json({ message: "Table not found" });
    }

    const query2 = updateQuery(
      "tables",
      ["name", "quantity", "location", "status"],
      [name, quantity, location, status],
      "tables_id",
      id
    );
    const ans2 = await pool.query(query2);

    if (ans2.rowCount === 0) {
      res.status(400).json({ message: "Error in update item" });
    } else {
      const newTable = ans2.rows[0];
      res.status(200).json(newTable);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};
export {
  createTable,
  deleteTableById,
  getTableById,
  getAllTable,
  updateTableById,
};
