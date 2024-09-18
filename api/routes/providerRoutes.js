import express from "express";

import {
  createProvider,
  deleteProviderById,
  getAllProvider,
  getProviderById,
  updateProviderById,
} from "../controllers/providerController.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.get("/getall", getAllProvider);
router.get("/:id", getProviderById);
router.post("/create", upload.single("image"), createProvider);
router.delete("/:id", deleteProviderById);
router.put("/:id", upload.single("image"), updateProviderById);

export default router;
