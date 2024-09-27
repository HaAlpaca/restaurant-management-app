import express from "express";
import { StatusCodes } from "http-status-codes";
import {billRoute} from "./billRoute.js";
const Router = express.Router();
// check api v1
Router.get("/status", (req, res) => {
  res
    .status(StatusCodes.OK)
    .json({ message: "API v1 already to use.", status: StatusCodes.OK });
});
//board APIs
Router.use("/bill", billRoute);

export const APIs_v1 = Router;
