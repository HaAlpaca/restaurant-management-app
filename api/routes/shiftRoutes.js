import express from "express";
import {
  createShift,
  deleteShiftById,
  getAllShift,
  getShiftById,
  updateShiftById,
} from "../controllers/shiftController.js";

const router = express.Router();

router.get("/getall", getAllShift);
router.get("/:id", getShiftById);
router.post("/create", createShift);
router.delete("/:id", deleteShiftById);
router.put("/:id", updateShiftById);

export default router;
