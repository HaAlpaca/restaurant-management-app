import express from "express";
import {
  sumBill,
  sumBillForChart,
  sumItem,
  sumProductfromProvider,
  tableStatusOccupied,
} from "../../../controllers/v1/report/reportController.js";
const Router = express.Router();

Router.get("/sumitem", sumItem);
Router.get("/sumbill", sumBill);
Router.get("/sumproductfromprovider", sumProductfromProvider);
Router.get("/sumbillforchart", sumBillForChart);
Router.get("/tablestatusoccupied", tableStatusOccupied);
export const reportRoute = Router;
