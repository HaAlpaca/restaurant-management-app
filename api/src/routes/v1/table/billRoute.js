import express from "express";
import {
  createBill,
  deleteBillById,
  getAllBill,
  getBillById,
} from "../../../controllers/v1/Table/billController.js";
import { Validation } from "../../../validations/Validation.js";
import { getAllBillWith2Filter } from "../../../controllers/v1/report/reportController.js";

const Router = express.Router();
Router.route("/").post(createBill);
Router.get("/reportbill", getAllBillWith2Filter);
Router.route("/getall").get(getAllBill);
Router.route("/:id")
  .get(Validation.checkID, getBillById)
  .delete(Validation.checkID, deleteBillById);
export const billRoute = Router;
