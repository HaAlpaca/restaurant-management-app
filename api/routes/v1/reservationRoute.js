import express from "express";

import {
  createReservation,
  deleteReservationById,
  getAllReservation,
  getReservationById,
  updateReservationById,
} from "../../controllers/v1/reservationController.js";
import {
  addTableToReservation,
  getTablefromReservation,
} from "../../controllers/v1/joinTable/reservationTable.js";
const Router = express.Router();
Router.route("/").post(createReservation);
Router.route("/getall").get(getAllReservation);
Router.route("/addtable/:id")
  .post(addTableToReservation)
  .get(getTablefromReservation);
Router.route("/:id")
  .get(getReservationById)
  .delete(deleteReservationById)
  .put(updateReservationById);
export const reservationRoute = Router;
