import express from "express";
import {
  createItem,
  deleteItemById,
  getAllItem,
  getAllItemStatus,
  getItemById,
  updateItemById,
} from "../../../controllers/v1/Table/itemController.js";
import upload from "../../../middlewares/upload.js";
import { Validation } from "../../../validations/Validation.js";
import { SeedItemData } from "../../../controllers/v1/Seed/itemSeedController.js";

const Router = express.Router();
Router.route("/").post(upload.single("image"), createItem);
Router.route("/getall").get(getAllItem);
Router.route("/getallstatus").get(getAllItemStatus);
Router.route("/SeedData/:id").get(SeedItemData);
Router.route("/:id")
  .get(Validation.checkID, getItemById)
  .delete(Validation.checkID, deleteItemById)
  .patch(Validation.checkID, upload.single("image"), updateItemById);
export const itemRoute = Router;

// upload image
