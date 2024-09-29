import express from "express";
import {
  createStaff,
  deleteStaffById,
  getAllStaff,
  getStaffById,
  updateStaffById,
} from "../../controllers/v1/staffController.js";
import upload from "../../middlewares/upload.js";
const Router = express.Router();
Router.route("/").post(upload.single("image"), createStaff);
Router.route("/getall").get(getAllStaff);
Router.route("/:id")
  .get(getStaffById)
  .delete(deleteStaffById)
  .patch(upload.single("image"), updateStaffById);
export const staffRoute = Router;
