import express from "express";
import {
  createBill,
  deleteBillById,
  getAllBill,
  getBillById,
} from "../../controllers/v1/billController.js";
import { Validation } from "../../validations/Validation.js";

const Router = express.Router();
Router.route("/").post(createBill);
Router.route("/getall").get(getAllBill);
Router.route("/:id")
  .get(Validation.checkID, getBillById)
  .delete(Validation.checkID, deleteBillById);
export const billRoute = Router;
