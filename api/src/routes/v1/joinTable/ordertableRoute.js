import express from "express";
import {
  add,
  getall,
  getOrdersByTable,
  getTablesByOrder,
  remove,
} from "../../../controllers/v1/joinTable/ordertableController.js";

const Router = express.Router();

Router.get("/getall", getall);
Router.get("/order/:id", getTablesByOrder);
Router.post("/assign", add);
Router.delete("/remove", remove);
Router.get("/table/:id", getOrdersByTable);

export const ordertableRoute = Router;
