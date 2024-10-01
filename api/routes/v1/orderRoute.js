import express from "express";

import {
  createOrder,
  deleteOrderById,
  getAllOrder,
  getOrderById,
} from "../../controllers/v1/orderController.js";
import {
  addItemToOrder,
  deleteItemFromOrder,
  getItemfromOrder,
  updateItemForOrder,
} from "../../controllers/v1/joinTable/orderItem.js";
const Router = express.Router();
Router.route("/").post(createOrder);
Router.route("/getall").get(getAllOrder);
Router.route("/joinitem/:id")
  .post(addItemToOrder)
  .get(getItemfromOrder)
  .delete(deleteItemFromOrder)
  .put(updateItemForOrder);
Router.route("/:id").get(getOrderById).delete(deleteOrderById);
export const orderRoute = Router;
