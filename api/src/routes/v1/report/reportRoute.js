import express from "express";
import { sumItem } from "../../../controllers/v1/report/reportController.js";
const Router = express.Router();

Router.get("/sumitem", sumItem);
export const reportRoute = Router;
