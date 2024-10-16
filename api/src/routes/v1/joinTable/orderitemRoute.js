import express from "express";
import {
  addOrdersItems,
  deleteOrdersItems,
  getall,
  getItemsByOrder,
  getOrdersByItem,
} from "../../../controllers/v1/joinTable/orderitemController.js";

const Router = express.Router();

Router.get("/getall", getall);
Router.get("/order/:id", getItemsByOrder);
Router.post("/assign", addOrdersItems);
Router.delete("/remove", deleteOrdersItems);
Router.get("/item/:id", getOrdersByItem);
export const orderitemRoute = Router;
