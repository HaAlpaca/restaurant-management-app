import express from "express";

import {
  createOrder,
  deleteOrderById,
  getAllOrder,
  getOrderById,
  updateOrderById,
} from "../../../controllers/v1/Table/orderController.js";
import { Validation } from "../../../validations/Validation.js";
import { SeedOrderData } from "../../../controllers/v1/Seed/orderSeedController.js";
const Router = express.Router();
Router.route("/").post(createOrder);
Router.route("/getall").get(getAllOrder);
Router.route("/SeedData/:id").get(SeedOrderData);
Router.route("/:id")
  .get(Validation.checkID, getOrderById)
  .patch(Validation.checkID, updateOrderById)
  .delete(Validation.checkID, deleteOrderById);
export const orderRoute = Router;
