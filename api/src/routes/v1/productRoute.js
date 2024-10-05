import express from "express";
import {
  createProduct,
  deleteProductById,
  getAllProduct,
  getProductById,
  updateProductById,
} from "../../controllers/v1/productController.js";
import upload from "../../middlewares/upload.js";
import { Validation } from "../../validations/Validation.js";

const Router = express.Router();
Router.route("/").post(upload.single("image"), createProduct);
Router.route("/getall").get(getAllProduct);
Router.route("/:id")
  .get(Validation.checkID, getProductById)
  .delete(Validation.checkID, deleteProductById)
  .patch(Validation.checkID, upload.single("image"), updateProductById);
export const productRoute = Router;
