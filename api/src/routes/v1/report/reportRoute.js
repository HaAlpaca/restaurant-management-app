import express from "express";
import {
  getAllBillWithFilter,
  getAllTransactionsWithFilter,
  getStaffSalaryWithFilter,
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
Router.get("/reportbill", getAllBillWithFilter);
Router.get("/report_transaction", getAllTransactionsWithFilter);
Router.get("/report_staffsalary", getStaffSalaryWithFilter);
export const reportRoute = Router;
