import express from "express";
import {
  createTable,
  deleteTableById,
  getAllTable,
  getTableById,
  updateTableById,
} from "../controllers/tableController.js";

const router = express.Router();

router.get("/getall", getAllTable);
router.get("/:id", getTableById);
router.post("/create", createTable);
router.delete("/:id", deleteTableById);
router.put("/:id", updateTableById);

export default router;
