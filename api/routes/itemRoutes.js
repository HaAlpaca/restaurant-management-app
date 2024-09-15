import express from "express";

import {
  createItem,
  deleteItemById,
  getAllItem,
  getItemById,
  updateItemById,
} from "../controllers/itemController.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.get("/getall", getAllItem);
router.get("/:id", getItemById);
router.post("/create", upload.single("image"), createItem);
router.delete("/:id", deleteItemById);
router.put("/:id", upload.single("image"), updateItemById);

export default router;
