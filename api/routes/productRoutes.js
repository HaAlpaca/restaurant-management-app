import express from "express";

import {
  createProduct,
  deleteProductById,
  getAllProduct,
  getProductById,
  updateProductById,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/getall", getAllProduct);
router.get("/:id", getProductById);
router.post("/create", createProduct);
router.delete("/:id", deleteProductById);
router.put("/:id", updateProductById);

export default router;
