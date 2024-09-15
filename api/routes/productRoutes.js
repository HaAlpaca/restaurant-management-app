import express from "express";

import {
  createProduct,
  deleteProductById,
  getAllProduct,
  getProductById,
  updateProductById,
} from "../controllers/productController.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.get("/getall", getAllProduct);
router.get("/:id", getProductById);
router.post("/create", upload.single("image"), createProduct);
router.delete("/:id", deleteProductById);
router.put("/:id", upload.single("image"), updateProductById);

export default router;
