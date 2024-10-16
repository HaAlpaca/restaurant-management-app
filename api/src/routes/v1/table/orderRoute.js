import express from "express";

import {
  createOrder,
  deleteOrderById,
  getAllOrder,
  getOrderById,
  updateOrderById,
} from "../../../controllers/v1/Table/orderController.js";
import { Validation } from "../../../validations/Validation.js";
const Router = express.Router();
Router.route("/").post(createOrder);
Router.route("/getall").get(getAllOrder);
Router.route("/:id")
  .get(Validation.checkID, getOrderById)
  .patch(Validation.checkID, updateOrderById)
  .delete(Validation.checkID, deleteOrderById);
export const orderRoute = Router;
