import express from "express";
import {
  createBill,
  deleteBillById,
  getAllBill,
  getBillById,
  updateBillById,
} from "../../controllers/v1/billController.js";

const Router = express.Router();
Router.route("/").post(createBill);
Router.route("/getall").get(getAllBill);
Router.route("/:id")
  .get(getBillById)
  .put(updateBillById)
  .delete(deleteBillById);
export const billRoute = Router;
