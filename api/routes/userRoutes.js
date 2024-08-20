import express from "express";
import { testUser,testUpload } from '../controllers/userControllers.js'
import upload from "../middlewares/upload.js";
const router = express.Router();

router.get("/testuser", testUser)
router.post("/testupload",upload.single("images"), testUpload)

export default router