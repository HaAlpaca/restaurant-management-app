import express from "express";
import {
  createItem,
  deleteItemById,
  getAllItem,
  getItemById,
  updateItemById,
} from "../../controllers/v1/itemController.js";
import upload from "../../middlewares/upload.js";
import { Validation } from "../../validations/Validation.js";

const Router = express.Router();
Router.route("/").post(upload.single("image"), createItem);
Router.route("/getall").get(getAllItem);
Router.route("/:id")
  .get(Validation.checkID, getItemById)
  .delete(Validation.checkID, deleteItemById)
  .patch(Validation.checkID, upload.single("image"), updateItemById);
export const itemRoute = Router;

// upload image
