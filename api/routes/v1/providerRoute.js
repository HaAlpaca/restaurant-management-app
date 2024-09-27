import express from "express";
import {
  createProvider,
  deleteProviderById,
  getAllProvider,
  getProviderById,
  updateProviderById,
} from "../../controllers/v1/providerController.js";
import upload from "../../middlewares/upload.js";
const Router = express.Router();
Router.route("/").post(upload.single("image"), createProvider);
Router.route("/getall").get(getAllProvider);
Router.route("/:id")
  .get(getProviderById)
  .delete(deleteProviderById)
  .put(upload.single("image"), updateProviderById);
export const providerRoute = Router;
