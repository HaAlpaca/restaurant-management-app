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
import { productitemRoute } from "./joinTable/productitemRoute.js";
import { reportRoute } from "./report/reportRoute.js";
import { authRoute } from "./authRoute.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
const Router = express.Router();
// check api v1
Router.get("/status", (req, res) => {
  res
    .status(StatusCodes.OK)
    .json({ message: "API v1 already to use.", status: StatusCodes.OK });
});

Router.use(
  "/provider",
  authMiddleware.isAuthorized(["Quản Lý", "Nhân Viên Bếp", "Nhân Viên Kho"]),
  providerRoute
);
Router.use(
  "/item",
  authMiddleware.isAuthorized([
    "Quản Lý",
    "Bồi Bàn",
    "Tiếp Tân",
    "Nhân Viên Bếp",
    "Nhân Viên Kho",
  ]),
  itemRoute
);
Router.use(
  "/product",
  authMiddleware.isAuthorized([
    "Quản Lý",
    "Bồi Bàn",
    "Tiếp Tân",
    "Nhân Viên Bếp",
    "Nhân Viên Kho",
  ]),
  productRoute
);
Router.use(
  "/order",
  authMiddleware.isAuthorized(["Quản Lý", "Bồi Bàn", "Tiếp Tân"]),
  orderRoute
);
Router.use(
  "/table",
  authMiddleware.isAuthorized(["Quản Lý", "Bồi Bàn", "Tiếp Tân"]),
  tableRoute
);
Router.use(
  "/reservation",
  authMiddleware.isAuthorized(["Quản Lý", "Bồi Bàn", "Tiếp Tân"]),
  reservationRoute
);
Router.use(
  "/bill",
  authMiddleware.isAuthorized([
    "Quản Lý",
    "Bồi Bàn",
    "Tiếp Tân",
    "Nhân Viên Bếp",
    "Nhân Viên Kho",
  ]),
  billRoute
);
Router.use(
  "/staff",
  authMiddleware.isAuthorized([
    "Quản Lý",
    "Bồi Bàn",
    "Tiếp Tân",
    "Nhân Viên Bếp",
    "Nhân Viên Kho",
  ]),
  staffRoute
);
Router.use(
  "/shift",
  authMiddleware.isAuthorized([
    "Quản Lý",
    "Bồi Bàn",
    "Tiếp Tân",
    "Nhân Viên Bếp",
    "Nhân Viên Kho",
  ]),
  shiftRoute
);

// join table
// manager is full action
//
Router.use(
  "/transaction",
  authMiddleware.isAuthorized(["Quản Lý", "Nhân Viên Bếp", "Nhân Viên Kho"]),
  transactionRoute
);
Router.use(
  "/orderitem",
  authMiddleware.isAuthorized([
    "Quản Lý",
    "Bồi Bàn",
    "Tiếp Tân",
    "Nhân Viên Bếp",
    "Nhân Viên Kho",
  ]),
  orderitemRoute
);
Router.use(
  "/reservationtable",
  authMiddleware.isAuthorized([
    "Quản Lý",
    "Bồi Bàn",
    "Tiếp Tân",
    "Nhân Viên Bếp",
    "Nhân Viên Kho",
  ]),
  reservationtableRoute
);
Router.use(
  "/workingtime",
  authMiddleware.isAuthorized([
    "Quản Lý",
    "Bồi Bàn",
    "Tiếp Tân",
    "Nhân Viên Bếp",
    "Nhân Viên Kho",
  ]),
  staffshiftRoute
);
Router.use(
  "/productitem",
  authMiddleware.isAuthorized([
    "Quản Lý",
    "Bồi Bàn",
    "Tiếp Tân",
    "Nhân Viên Bếp",
    "Nhân Viên Kho",
  ]),
  productitemRoute
);
// report
Router.use(
  "/report",
  authMiddleware.isAuthorized([
    "Quản Lý",
    "Bồi Bàn",
    "Tiếp Tân",
    "Nhân Viên Bếp",
    "Nhân Viên Kho",
  ]),
  reportRoute
);
// auth
Router.use("/auth", authRoute);

// test auth ********************************
Router.use(
  "/test_auth_item",
  authMiddleware.isAuthorized(["Quản Lý", "Nhân Viên Bếp", "Nhân Viên Kho"]),
  itemRoute
);
// mobile
Router.use(
  "/test_auth_reservation",
  authMiddleware.isAuthorized(["Quản Lý", "Bồi Bàn", "Tiếp Tân"]),
  reservationRoute
);
Router.use(
  "/test_auth_table",
  authMiddleware.isAuthorized(["Quản Lý", "Bồi Bàn", "Tiếp Tân"]),
  tableRoute
);
Router.use(
  "/test_auth_order",
  authMiddleware.isAuthorized(["Quản Lý", "Bồi Bàn", "Tiếp Tân"]),
  orderRoute
);

export const APIs_v1 = Router;
