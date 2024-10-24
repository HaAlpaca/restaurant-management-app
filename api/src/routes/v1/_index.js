import express from "express";
import { StatusCodes } from "http-status-codes";

import { transactionRoute } from "./joinTable/transactionRoute.js";
import { providerRoute } from "./table/providerRoute.js";
import { itemRoute } from "./table/itemRoute.js";
import { productRoute } from "./table/productRoute.js";
import { orderRoute } from "./table/orderRoute.js";
import { tableRoute } from "./table/tableRoute.js";
import { reservationRoute } from "./table/reservationRoute.js";
import { billRoute } from "./table/billRoute.js";
import { staffRoute } from "./table/staffRoute.js";
import { shiftRoute } from "./table/shiftRoute.js";
import { orderitemRoute } from "./joinTable/orderitemRoute.js";
import { reservationtableRoute } from "./joinTable/reservationtableRoute.js";
import { staffshiftRoute } from "./joinTable/staffshiftRoute.js";
import { ordertableRoute } from "./joinTable/ordertableRoute.js";
import { productitemRoute } from "./joinTable/productitemRoute.js";
import { reportRoute } from "./report/reportRoute.js";
const Router = express.Router();
// check api v1
Router.get("/status", (req, res) => {
  res
    .status(StatusCodes.OK)
    .json({ message: "API v1 already to use.", status: StatusCodes.OK });
});
//bill APIs
Router.use("/provider", providerRoute);
Router.use("/item", itemRoute);
Router.use("/product", productRoute);
Router.use("/order", orderRoute);
Router.use("/table", tableRoute);
Router.use("/reservation", reservationRoute);
Router.use("/bill", billRoute);
Router.use("/staff", staffRoute);
Router.use("/shift", shiftRoute);
// join table
Router.use("/transaction", transactionRoute);
Router.use("/orderitem", orderitemRoute);
Router.use("/reservationtable", reservationtableRoute);
Router.use("/workingtime", staffshiftRoute);
Router.use("/ordertable", ordertableRoute);
Router.use("/productitem", productitemRoute);
Router.use("/report", reportRoute);
// report
export const APIs_v1 = Router;
