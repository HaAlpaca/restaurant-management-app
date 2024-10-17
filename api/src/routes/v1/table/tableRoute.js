import express from "express";
import {
  createTable,
  deleteTableById,
  getAllTable,
  getTableById,
  updateTableById,
} from "../../../controllers/v1/Table/tableController.js";
import { Validation } from "../../../validations/Validation.js";
import { SeedTableData } from "../../../controllers/v1/Seed/tableSeedController.js";

const Router = express.Router();
Router.route("/").post(createTable);
Router.route("/getall").get(getAllTable);
Router.route("/SeedData/:id").get(SeedTableData);

Router.route("/:id")
  .get(Validation.checkID, getTableById)
  .patch(Validation.checkID, updateTableById)
  .delete(Validation.checkID, deleteTableById);
export const tableRoute = Router;
