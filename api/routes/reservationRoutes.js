import express from "express";
import {
  createReservation,
  deleteReservationById,
  getAllReservation,
  getReservationById,
  updateReservationById,
} from "../controllers/reservationController.js";

const router = express.Router();

router.get("/getall", getAllReservation);
router.get("/:id", getReservationById);
router.post("/create", createReservation);
router.delete("/:id", deleteReservationById);
router.put("/:id", updateReservationById);
// router.get("/user/:username", getUserPosts);

export default router;
