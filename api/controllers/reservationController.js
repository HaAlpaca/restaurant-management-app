import { pool, client } from "../db/ConnectDb.js";
import {
  deleteIdQuery,
  insertQuery,
  selectAllQuery,
  selectIdQuery,
  updateQuery,
} from "../utils/queryParams.js";

const createReservation = async (req, res) => {
  try {
    const { name, quantity, phone, email, time } = req.body;

    const query = insertQuery(
      "reservations",
      ["name", "quantity", "phone", "email", "time"],
      [name, quantity, phone, email, time]
    );
    const ans = await pool.query(query);

    if (ans.rowCount === 0) {
      res.status(400).json({ message: "Error in creating reservation" });
    } else {
      //return new
      const newReservation = ans.rows[0];
      res.status(200).json(newReservation);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

const getReservationById = async (req, res) => {
  try {
    const id = req.params.id;
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ message: "Invalid reservation ID. ID must be a number." });
    }

    const query = selectIdQuery("reservations_id", id, "reservations");
    const ans = await pool.query(query);

    if (ans.rows.length === 0) {
      return res.status(404).json({ message: "reservation not found" });
    }
    const reservation = ans.rows[0];
    res.status(200).json(reservation);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.error(err);
  }
};
const getAllReservation = async (req, res) => {
  try {
    const query = selectAllQuery("reservations");

    const ans = await pool.query(query);

    if (ans.rows.length === 0) {
      return res.status(404).json({ message: "reservation not found" });
    }
    const reservation = ans.rows;
    res.status(200).json(reservation);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

const deleteReservationById = async (req, res) => {
  try {
    const id = req.params.id;
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ message: "Invalid reservation ID. ID must be a number." });
    }
    const query = selectIdQuery("reservations_id", id, "reservations");

    const ans = await pool.query(query);

    if (ans.rows.length === 0) {
      return res.status(404).json({ message: "reservation not found" });
    }

    const query2 = deleteIdQuery("reservations_id", id, "reservations");

    const ans2 = await pool.query(query2);

    if (ans2.rowCount === 0) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.status(200).json({ message: "Reservation deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

const updateReservationById = async (req, res) => {
  try {
    const { name, quantity, phone, email, time } = req.body;

    const id = req.params.id;
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ message: "Invalid reservation ID. ID must be a number." });
    }

    const query = selectIdQuery("reservations_id", id, "reservations");

    const ans = await pool.query(query);

    if (ans.rows.length === 0) {
      return res.status(404).json({ message: "reservation not found" });
    }

    const query2 = updateQuery(
      "reservations",
      ["name", "quantity", "phone", "email", "time"],
      [name, quantity, phone, email, time],
      "reservations_id",
      id
    );
    const ans2 = await pool.query(query2);

    if (ans2.rowCount === 0) {
      res.status(400).json({ message: "Error in update item" });
    } else {
      const newReservation = ans2.rows[0];
      res.status(200).json(newReservation);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};
export {
  createReservation,
  deleteReservationById,
  getReservationById,
  getAllReservation,
  updateReservationById,
};
