import express from "express";
import { StatusCodes } from "http-status-codes";
import { billRoute } from "./billRoute.js";
import { tableRoute } from "./tableRoute.js";
import { itemRoute } from "./itemRoute.js";
import { staffRoute } from "./staffRoute.js";
import { productRoute } from "./productRoute.js";
import { orderRoute } from "./orderRoute.js";
import { reservationRoute } from "./reservationRoute.js";
import { shiftRoute } from "./shiftRoute.js";
import { providerRoute } from "./providerRoute.js";
import { transactionRoute } from "./joinTable/transactionRoute.js";
import { productitemRoute } from "./joinTable/productitemRoute.js";
import { ordertableRoute } from "./joinTable/ordertableRoute.js";
import { reservationtableRoute } from "./joinTable/reservationtableRoute.js";
import { orderitemRoute } from "./joinTable/orderitemRoute.js";
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
// Router.use("/transaction", transactionRoute);
// Router.use("/orderitem", orderitemRoute);
// Router.use("/reservationtable", reservationtableRoute);
// Router.use("/staffshift", staffRoute);
// Router.use("/ordertable", ordertableRoute);
// Router.use("/productitem", productitemRoute);
// report 
export const APIs_v1 = Router;
