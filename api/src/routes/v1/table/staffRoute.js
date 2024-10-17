import express from "express";
import {
  createStaff,
  deleteStaffById,
  getAllStaff,
  getStaffById,
  updateStaffById,
} from "../../../controllers/v1/Table/staffController.js";
import upload from "../../../middlewares/upload.js";
import { Validation } from "../../../validations/Validation.js";
import { SeedStaffData } from "../../../controllers/v1/Seed/staffSeedController.js";

const Router = express.Router();
Router.route("/").post(upload.single("image"), createStaff);
Router.route("/getall").get(getAllStaff);
Router.route("/SeedData/:id").get(SeedStaffData);
Router.route("/:id")
  .get(Validation.checkID, getStaffById)
  .delete(Validation.checkID, deleteStaffById)
  .patch(Validation.checkID, upload.single("image"), updateStaffById);
export const staffRoute = Router;
