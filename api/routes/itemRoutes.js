import express from "express";

import {
  createItem,
  deleteItemById,
  getAllItem,
  getItemById,
  updateItemById,
} from "../controllers/itemController.js";

const router = express.Router();

router.get("/getall", getAllItem);
router.get("/:id", getItemById);
router.post("/create", createItem);
router.delete("/:id", deleteItemById);
router.put("/:id", updateItemById);

export default router;
