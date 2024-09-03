import Reservation from "../models/resevationModel.js";
import Table from "../models/tableModel.js";
import mongoose from "mongoose";

// const check = async (models, modelScheme, res) => {
//   for (const model of models) {
//     if (!mongoose.Types.ObjectId.isValid(model)) {
//       return res
//         .status(400)
//         .json({ message: `Invalid reservation ID: ${model}` });
//     }

//     const ans = await modelScheme.findById(model);
//     if (!ans) {
//       return res.status(404).json({
//         message: `Reservation with ID: ${model} not found`,
//       });
//     }
//   }
// };

const createTable = async (req, res) => {
  try {
    const { tableName, quantity, location, status, reservations } = req.body;

    // checking reservation invalid or not found
    if (reservations.length > 0) {
      for (const reservation of reservations) {
        if (!mongoose.Types.ObjectId.isValid(reservation)) {
          return res
            .status(400)
            .json({ message: `Invalid reservation ID: ${reservation}` });
        }

        const ans = await Reservation.findById(reservation);
        if (!ans) {
          return res.status(404).json({
            message: `Reservation with ID: ${reservation} not found`,
          });
        }
      }
    }

    const table = new Table({
      tableName,
      quantity,
      location,
      status,
      reservations,
    });
    await table.save();
    res
      .status(201)
      .json({ message: "Create new table completed", details: table });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

const getTableById = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id).populate("reservations");
    // console.log(table);
    if (!table) {
      return res.status(404).json({ error: "Reservation not found" });
    }
    const { tableName, quantity, location, status, reservations } = table;

    res.status(201).json({
      message: "Get Table By Id Completed",
      details: {
        tableName,
        quantity,
        location,
        status,
        reservations,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

const getAllTable = async (req, res) => {
  try {
    const table = await Table.find({})
      .populate("reservations")
      .sort({ createdAt: -1 });
    res.status(201).json({
      message: "Get all reservation completed",
      details: table,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

const deleteTableById = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) {
      return res.status(404).json({ error: "Table not found" });
    }
    await Table.findByIdAndDelete(req.params.id);
    res.status(201).json({
      message: "Delete Table completed",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

const updateTableById = async (req, res) => {
  try {
    // finding table
    const table = await Table.findById(req.params.id);
    if (!table) {
      return res.status(404).json({ error: "Table not found" });
    }

    const { tableName, quantity, location, status, reservations } = req.body;

    // checking reservation invalid or not found
    if (reservations.length > 0) {
      for (const reservation of reservations) {
        if (!mongoose.Types.ObjectId.isValid(reservation)) {
          return res
            .status(400)
            .json({ message: `Invalid reservation ID: ${reservation}` });
        }

        const ans = await Reservation.findById(reservation);
        if (!ans) {
          return res.status(404).json({
            message: `Reservation with ID: ${reservation} not found`,
          });
        }
      }
    }

    // update
    const updateTable = {
      tableName,
      quantity,
      location,
      status,
      reservations,
    };

    const update = await Table.findByIdAndUpdate(req.params.id, updateTable);

    // not return reservation info
    if (!update) res.status(400).json({ error: "Error in update table" });
    res.status(201).json({
      message: "Update table completed",
      details: updateTable,
    });
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
