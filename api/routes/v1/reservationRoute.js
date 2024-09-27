import express from "express";

import {
  createReservation,
  deleteReservationById,
  getAllReservation,
  getReservationById,
  updateReservationById,
} from "../../controllers/v1/reservationController.js";
const Router = express.Router();
Router.route("/").post(createReservation);
Router.route("/getall").get(getAllReservation);
Router.route("/:id")
  .get(getReservationById)
  .delete(deleteReservationById)
  .put(updateReservationById);
export const reservationRoute = Router;
