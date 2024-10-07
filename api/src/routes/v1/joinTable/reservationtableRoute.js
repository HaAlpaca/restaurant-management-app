import express from "express";
import {
  add,
  getReservationsByTable,
  getTablesByReservation,
  remove,
} from "../../../controllers/v1/joinTable/reservationTableController.js";
// import { assignTableToReservation } from "../../../controllers/v1/joinTable/reservationTableController.js";
const Router = express.Router();

Router.get("/table/:id", getReservationsByTable);
Router.post("/assign", add);
Router.delete("/remove", remove);
Router.get("/reservation/:id", getTablesByReservation);
// Router.post("/reservation/add-table", addTableToReservation);
// Router.delete("/reservation/remove-table", removeTableFromReservation);

export const reservationtableRoute = Router;
