import express from "express";
import {
  createStaff,
  deleteStaffById,
  getAllStaff,
  getStaffById,
  updateStaffById,
} from "../controllers/staffController.js";

const router = express.Router();

router.get("/getall", getAllStaff);
router.get("/:id", getStaffById);
router.post("/create", createStaff);
router.delete("/:id", deleteStaffById);
router.put("/:id", updateStaffById);

export default router;
