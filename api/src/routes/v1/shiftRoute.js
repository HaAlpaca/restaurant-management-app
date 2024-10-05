import express from "express";
import {
  createShift,
  deleteShiftById,
  getAllShift,
  getShiftById,
  updateShiftById,
} from "../../controllers/v1/shiftController.js";
import { Validation } from "../../validations/Validation.js";

const Router = express.Router();
Router.route("/").post(createShift);
Router.route("/getall").get(getAllShift);
Router.route("/:id")
  .get(Validation.checkID, getShiftById)
  .delete(Validation.checkID, deleteShiftById)
  .patch(Validation.checkID, updateShiftById);
export const shiftRoute = Router;
