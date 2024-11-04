import express from "express";
import {
  assignTransactions,
  deleteTransaction,
  getAllTransactions,
  getProductByProvider,
  getProviderByProduct,
  getTransactionById,
  updateTransaction,
} from "../../../controllers/v1/joinTable/transactionController.js";
const Router = express.Router();

Router.get("/getall", getAllTransactions);
Router.get("/:id", getTransactionById);
Router.patch("/:id", updateTransaction);
Router.post("/assign", assignTransactions);
Router.get("/product/:id", getProviderByProduct);
Router.get("/provider/:id", getProductByProvider);
Router.delete("/remove/:id", deleteTransaction);

export const transactionRoute = Router;
