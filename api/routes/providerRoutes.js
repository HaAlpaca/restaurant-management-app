import express from "express";

import {
  createProvider,
  deleteProviderById,
  getAllProvider,
  getProviderById,
  updateProviderById,
} from "../controllers/providerController.js";

const router = express.Router();

router.get("/getall", getAllProvider);
router.get("/:id", getProviderById);
router.post("/create", createProvider);
router.delete("/:id", deleteProviderById);
router.put("/:id", updateProviderById);

export default router;
