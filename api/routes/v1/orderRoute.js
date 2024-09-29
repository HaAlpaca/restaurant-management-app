import express from "express";

import {
  createOrder,
  deleteOrderById,
  getAllOrder,
  getOrderById,
  updateOrderById,
} from "../../controllers/v1/orderController.js";
const Router = express.Router();
Router.route("/").post(createOrder);
Router.route("/getall").get(getAllOrder);
Router.route("/:id")
  .get(getOrderById)
  .delete(deleteOrderById)
  .patch(updateOrderById);
export const orderRoute = Router;
