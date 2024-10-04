import express from "express";
import {
  assignShiftToStaff,
  getShiftsByStaff,
  getStaffByShift,
  removeShiftFromStaff,
} from "../../../controllers/v1/joinTable/staffShiftController.js";
const Router = express.Router();

Router.post("/assign-shift", assignShiftToStaff); // Gán shift cho staff
Router.get("/staff/:id", getShiftsByStaff); // Lấy tất cả shift của một staff
Router.get("/shift/:id", getStaffByShift); // Lấy tất cả staff của một shift
Router.delete("/remove-shift", removeShiftFromStaff); // Xóa shift khỏi staff

export const staffshiftRoute = Router;
