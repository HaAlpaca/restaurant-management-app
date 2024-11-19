import express from "express";
import {
  addProductItem,
  deleteProductItem,
  getall,
  getItemsByProduct,
  getProductsByItem,
  updateQuantityProductItem,
} from "../../../controllers/v1/joinTable/productitemController.js";
const Router = express.Router();

Router.get("/item/:id", getProductsByItem);
Router.post("/assign", addProductItem);
Router.patch("/update", updateQuantityProductItem);
Router.delete("/remove", deleteProductItem);
Router.get("/product/:id", getItemsByProduct);
Router.get("/getall", getall);

export const productitemRoute = Router;
