import express from "express";
import {
  assignTransactions,
  deleteTransaction,
  getAllTransactions,
  getProductByProvider,
  getProviderByProduct,
  getTransactionById,
} from "../../../controllers/v1/joinTable/transactionController.js";
const Router = express.Router();

Router.get("/getall", getAllTransactions);
Router.get("/:id", getTransactionById);
Router.post("/assign", assignTransactions);
Router.get("/product/:id", getProviderByProduct);
Router.get("/provider/:id", getProductByProvider);
Router.delete("/remove/:id", deleteTransaction);

export const transactionRoute = Router;
