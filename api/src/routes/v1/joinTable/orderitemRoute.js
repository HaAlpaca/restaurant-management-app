import express from "express";
import {
  addOrdersItems,
  deleteOrderFromItems,
  getItemsByOrder,
  getOrdersByItem,
} from "../../../controllers/v1/joinTable/orderItemController.js";
const Router = express.Router();

Router.get("/order/:id", getItemsByOrder);
Router.post("/assign", addOrdersItems);
Router.delete("/deleteorder/:id", deleteOrderFromItems);
Router.get("/item/:id", getOrdersByItem);
export const orderitemRoute = Router;
