import express from "express";
import {
  createTable,
  deleteTableById,
  getAllTable,
  getTableById,
  updateTableById,
} from "../../controllers/v1/tableController.js";

const Router = express.Router();
Router.route("/").post(createTable);
Router.route("/getall").get(getAllTable);
Router.route("/:id")
  .get(getTableById)
  .patch(updateTableById)
  .delete(deleteTableById);
export const tableRoute = Router;
