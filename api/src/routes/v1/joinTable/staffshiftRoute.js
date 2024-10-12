import express from "express";
import {
  assign,
  getShiftsByStaff,
  getStaffByShift,
  remove,
} from "../../../controllers/v1/joinTable/staffshiftController.js";
const Router = express.Router();

Router.post("/assign", assign); // Gán shift cho staff
Router.get("/staff/:id", getShiftsByStaff); // Lấy tất cả shift của một staff
Router.get("/shift/:id", getStaffByShift); // Lấy tất cả staff của một shift
Router.delete("/remove", remove); // Xóa shift khỏi staff

export const staffshiftRoute = Router;
