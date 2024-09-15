import express from "express";

import {
  createBill,
  deleteBillById,
  getAllBill,
  getBillById,
  updateBillById,
} from "../controllers/billController.js";

const router = express.Router();

router.get("/getall", getAllBill);
router.get("/:id", getBillById);
router.post("/create", createBill);
router.delete("/:id", deleteBillById);
router.put("/:id", updateBillById);

export default router;
