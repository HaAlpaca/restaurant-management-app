import express from "express";
import {
  add,
  getall,
  getReservationsByTable,
  getTablesByReservation,
  remove,
} from "../../../controllers/v1/joinTable/reservationtableController.js";
const Router = express.Router();

// Router.get("/reservation/getall", getAllTablesByReservation);
// Router.get("/table/getall", getAllReservationsByTable);
Router.get("/getall", getall);
Router.get("/table/:id", getReservationsByTable);
Router.post("/assign", add);
Router.delete("/remove", remove);
Router.get("/reservation/:id", getTablesByReservation);
export const reservationtableRoute = Router;
