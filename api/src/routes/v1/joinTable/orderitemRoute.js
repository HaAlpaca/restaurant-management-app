import express from "express";
import {
  addOrdersItems,
  deleteOrderFromItems,
  getall,
  getItemsByOrder,
  getOrdersByItem,
} from "../../../controllers/v1/joinTable/orderitemController.js";

const Router = express.Router();

Router.get("/getall", getall);
Router.get("/order/:id", getItemsByOrder);
Router.post("/assign", addOrdersItems);
Router.delete("/deleteorder/:id", deleteOrderFromItems);
Router.get("/item/:id", getOrdersByItem);
export const orderitemRoute = Router;
