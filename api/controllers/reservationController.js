import Reservation from "../models/resevationModel.js";

const createReservation = async (req, res) => {
  try {
    const { customerName, phone, email } = req.body;
    const newReservation = new Reservation({
      customerName,
      // createdBy,
      phone,
      email,
    });
    await newReservation.save();
    res
      .status(201)
      .json({ message: "create new reservation", details: newReservation });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

const getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }
    res.status(201).json({
      message: "Get Reservation By Id Completed",
      details: reservation,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};
const getAllReservation = async (req, res) => {
  try {
    const reservations = await Reservation.find({}).sort({ createdAt: -1 });
    res.status(201).json({
      message: "Get all reservation completed",
      details: reservations,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

const deleteReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }
    await Reservation.findByIdAndDelete(req.params.id);
    res.status(201).json({
      message: "Delete reservation completed",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

const updateReservationById = async (req, res) => {
  try {
    const { customerName, phone, email } = req.body;
    const updateReservation = {
      customerName,
      phone,
      email,
    };
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    const update = await Reservation.findByIdAndUpdate(
      req.params.id,
      updateReservation
    );
    if (!update) res.status(400).json({ error: "Error in update reservation" });
    res.status(201).json({
      message: "Update reservation completed",
      details: updateReservation,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};
export {
  createReservation,
  getReservationById,
  getAllReservation,
  deleteReservationById,
  updateReservationById,
};
