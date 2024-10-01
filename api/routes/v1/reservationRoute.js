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
  deleteTableFromReservation,
  getTablefromReservation,
  updateTableForReservation,
} from "../../controllers/v1/joinTable/reservationTable.js";
const Router = express.Router();
Router.route("/").post(createReservation);
Router.route("/getall").get(getAllReservation);
Router.route("/jointable/:id")
  .post(addTableToReservation)
  .get(getTablefromReservation)
  .delete(deleteTableFromReservation)
  .put(updateTableForReservation);
Router.route("/:id")
  .get(getReservationById)
  .delete(deleteReservationById)
  .patch(updateReservationById);
export const reservationRoute = Router;
