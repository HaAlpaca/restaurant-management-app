import { pool, client } from "../db/ConnectDb.js";
import {
  deleteIdQuery,
  insertQuery,
  selectAllQuery,
  selectIdQuery,
  updateQuery,
} from "../utils/queryParams.js";

const createOrder = async (req, res) => {
  try {
    const { status } = req.body;

    const query = insertQuery("orders", ["status"], [status]);
    const ans = await pool.query(query);

    if (ans.rowCount === 0) {
      res.status(400).json({ message: "Error in creating order" });
    } else {
      //return new
      const newOrder = ans.rows[0];
      res.status(200).json(newOrder);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

const getOrderById = async (req, res) => {
  try {
    const id = req.params.id;
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ message: "Invalid order ID. ID must be a number." });
    }

    const query = selectIdQuery("orders_id", id, "orders");
    const ans = await pool.query(query);

    if (ans.rows.length === 0) {
      return res.status(404).json({ message: "order not found" });
    }
    const order = ans.rows[0];
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.error(err);
  }
};
const getAllOrder = async (req, res) => {
  try {
    const query = selectAllQuery("orders");

    const ans = await pool.query(query);

    if (ans.rows.length === 0) {
      return res.status(404).json({ message: "order not found" });
    }
    const order = ans.rows;
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

const deleteOrderById = async (req, res) => {
  try {
    const id = req.params.id;
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ message: "Invalid order ID. ID must be a number." });
    }
    const query = selectIdQuery("orders_id", id, "orders");

    const ans = await pool.query(query);

    if (ans.rows.length === 0) {
      return res.status(404).json({ message: "order not found" });
    }

    const query2 = deleteIdQuery("orders_id", id, "orders");

    const ans2 = await pool.query(query2);

    if (ans2.rowCount === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

const updateOrderById = async (req, res) => {
  try {
    const { status } = req.body;

    const id = req.params.id;
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ message: "Invalid order ID. ID must be a number." });
    }

    const query = selectIdQuery("orders_id", id, "orders");

    const ans = await pool.query(query);

    if (ans.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const query2 = updateQuery("orders", ["status"], [status], "orders_id", id);
    const ans2 = await pool.query(query2);

    if (ans2.rowCount === 0) {
      res.status(400).json({ message: "Error in update item" });
    } else {
      const newOrder = ans2.rows[0];
      res.status(200).json(newOrder);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};
export {
  createOrder,
  deleteOrderById,
  getOrderById,
  getAllOrder,
  updateOrderById,
};
