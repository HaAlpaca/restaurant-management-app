import express from "express";
import {
  createProvider,
  deleteProviderById,
  getAllProvider,
  getProviderById,
  updateProviderById,
} from "../../controllers/v1/providerController.js";
import upload from "../../middlewares/upload.js";
import { Validation } from "../../validations/Validation.js";
const Router = express.Router();
Router.route("/").post(upload.single("image"), createProvider);
Router.route("/getall").get(getAllProvider);
Router.route("/:id")
  .get(Validation.checkID, getProviderById)
  .delete(Validation.checkID, deleteProviderById)
  .patch(Validation.checkID, upload.single("image"), updateProviderById);
export const providerRoute = Router;
