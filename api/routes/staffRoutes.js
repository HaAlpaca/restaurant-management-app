import express from "express";
import {
  createStaff,
  deleteStaffById,
  getAllStaff,
  getStaffById,
  updateStaffById,
} from "../controllers/staffController.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.get("/getall", getAllStaff);
router.get("/:id", getStaffById);
router.post("/create",upload.single("image"), createStaff);
router.delete("/:id", deleteStaffById);
router.put("/:id",upload.single("image"), updateStaffById);

export default router;
