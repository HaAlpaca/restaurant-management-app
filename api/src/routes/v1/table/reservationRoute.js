import express from "express";

import {
  createReservation,
  deleteReservationById,
  getAllReservation,
  getReservationById,
  updateReservationById,
} from "../../../controllers/v1/Table/reservationController.js";
// import {
//   addTableToReservation,
//   deleteTableFromReservation,
//   getTablefromReservation,
//   updateTableForReservation,
// } from "../../controllers/v1/joinTable/reservationTableController.js";
import { Validation } from "../../../validations/Validation.js";
import { SeedReservationData } from "../../../controllers/v1/Seed/reservationSeedController.js";
const Router = express.Router();
Router.route("/").post(createReservation);
Router.route("/getall").get(getAllReservation);
Router.route("/SeedData/:id").get(SeedReservationData);
// Router.route("/jointable/:id")
//   .post(addTableToReservation)
//   .get(getTablefromReservation)
//   .delete(deleteTableFromReservation)
//   .put(updateTableForReservation);
Router.route("/:id")
  .get(Validation.checkID, getReservationById)
  .delete(Validation.checkID, deleteReservationById)
  .patch(Validation.checkID, updateReservationById);
export const reservationRoute = Router;
