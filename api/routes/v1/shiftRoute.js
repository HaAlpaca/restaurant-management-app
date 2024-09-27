import express from "express";
import {
  createShift,
  deleteShiftById,
  getAllShift,
  getShiftById,
  updateShiftById,
} from "../../controllers/v1/shiftController.js";

const Router = express.Router();
Router.route("/").post(createShift);
Router.route("/getall").get(getAllShift);
Router.route("/:id")
  .get(getShiftById)
  .delete(deleteShiftById)
  .put(updateShiftById);
export const shiftRoute = Router;
