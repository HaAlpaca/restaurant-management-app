import express from "express";
import {
  createBill,
  deleteBillById,
  getAllBill,
  getBillById,
  updateBillById,
} from "../../controllers/billController.js";
const Router = express.Router();
Router.route("/").post(createBill);
Router.route("/getall").get(getAllBill);
Router.route("/:id")
  .get(getBillById)
  .delete(deleteBillById)
  .put(updateBillById);
export const billRoute = Router;
