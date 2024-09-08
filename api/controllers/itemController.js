import { pool, client } from "../db/ConnectDb.js";
import {
  deleteIdQuery,
  insertQuery,
  selectAllQuery,
  selectIdQuery,
  updateQuery,
} from "../utils/queryParams.js";

const createItem = async (req, res) => {
  try {
    const { name, quantity, unit, category, price } = req.body;

    const query = insertQuery(
      "items",
      ["name", "quantity", "unit", "category", "price"],
      [name, quantity, unit, category, price]
    );
    const ans = await pool.query(query);

    if (ans.rowCount === 0) {
      res.status(400).json({ message: "Error in creating item" });
    } else {
      //return new
      const newItem = ans.rows[0];
      res.status(200).json(newItem);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

const getItemById = async (req, res) => {
  try {
    const id = req.params.id;
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ message: "Invalid item ID. ID must be a number." });
    }

    const query = selectIdQuery("items_id", id, "items");
    const ans = await pool.query(query);

    if (ans.rows.length === 0) {
      return res.status(404).json({ message: "item not found" });
    }
    const item = ans.rows[0];
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.error(err);
  }
};
const getAllItem = async (req, res) => {
  try {
    const query = selectAllQuery("items");

    const ans = await pool.query(query);

    if (ans.rows.length === 0) {
      return res.status(404).json({ message: "Items not found" });
    }
    const item = ans.rows;
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

const deleteItemById = async (req, res) => {
  try {
    const id = req.params.id;
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ message: "Invalid item ID. ID must be a number." });
    }
    const query = selectIdQuery("items_id", id, "items");

    const ans = await pool.query(query);

    if (ans.rows.length === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    const query2 = deleteIdQuery("items_id", id, "items");

    const ans2 = await pool.query(query2);

    if (ans2.rowCount === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

const updateItemById = async (req, res) => {
  try {
    const { name, quantity, unit, category, price } = req.body;

    const id = req.params.id;
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ message: "Invalid item ID. ID must be a number." });
    }

    const query = selectIdQuery("items_id", id, "items");

    const ans = await pool.query(query);

    if (ans.rows.length === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    const query2 = updateQuery(
      "items",
      ["name", "quantity", "unit", "category", "price"],
      [name, quantity, unit, category, price],
      "items_id",
      id
    );
    const ans2 = await pool.query(query2);
    
    if (ans2.rowCount === 0) {
      res.status(400).json({ message: "Error in update item" });
    } else {
      const newItem = ans2.rows[0];
      res.status(200).json(newItem);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};
export { createItem, deleteItemById, getItemById, getAllItem, updateItemById };
