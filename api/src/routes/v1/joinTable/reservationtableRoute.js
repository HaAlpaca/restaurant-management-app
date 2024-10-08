import express from "express";
import {
  add,
  getReservationsByTable,
  getTablesByReservation,
  remove,
} from "../../../controllers/v1/joinTable/reservationtableController.js";
const Router = express.Router();

Router.get("/table/:id", getReservationsByTable);
Router.post("/assign", add);
Router.delete("/remove", remove);
Router.get("/reservation/:id", getTablesByReservation);
export const reservationtableRoute = Router;
