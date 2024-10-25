import express from "express";
import {
  assign,
  getAllShift,
  getShiftsByStaff,
  getStaffByShift,
  remove,
  removeById,
  updateAttendance,
} from "../../../controllers/v1/joinTable/staffShiftController.js";

const Router = express.Router();

Router.post("/assign", assign); // Gán shift cho staff
Router.get("/getall", getAllShift); // lay ra het lich lam cua nhan vien
Router.get("/staff/:id", getShiftsByStaff); // Lấy tất cả shift của một staff
Router.get("/shift/:id", getStaffByShift); // Lấy tất cả staff của một shift
Router.post("/attendance/:id", updateAttendance); // cham cong => chuyen is_attendance sang true
Router.delete("/remove", remove); // Xóa shift khỞi staff
Router.delete("/delete/:id", removeById); // Xóa shift khỞi staff

export const staffshiftRoute = Router;
