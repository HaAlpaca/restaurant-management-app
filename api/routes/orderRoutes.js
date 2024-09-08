import express from "express";

import {
  createOrder,
  deleteOrderById,
  getAllOrder,
  getOrderById,
  updateOrderById,
} from "../controllers/orderController.js";

const router = express.Router();

router.get("/getall", getAllOrder);
router.get("/:id", getOrderById);
router.post("/create", createOrder);
router.delete("/:id", deleteOrderById);
router.put("/:id", updateOrderById);

export default router;
