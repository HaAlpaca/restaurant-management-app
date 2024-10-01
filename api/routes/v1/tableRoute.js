import express from "express";
import {
  createTable,
  deleteTableById,
  getAllTable,
  getTableById,
  updateTableById,
} from "../../controllers/v1/tableController.js";
import {
  addOrderToTable,
  deleteOrderFromTable,
  getOrderfromTable,
  updateOrderForTable,
} from "../../controllers/v1/joinTable/tableOrder.js";

const Router = express.Router();
Router.route("/").post(createTable);
Router.route("/getall").get(getAllTable);
Router.route("/joinorder/:id")
  .post(addOrderToTable)
  .get(getOrderfromTable)
  .delete(deleteOrderFromTable)
  .put(updateOrderForTable);
Router.route("/:id")
  .get(getTableById)
  .patch(updateTableById)
  .delete(deleteTableById);
export const tableRoute = Router;
