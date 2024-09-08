import express from "express";
import { testUser,testUpload, testPgsql } from '../controllers/demoController.js'
import upload from "../middlewares/upload.js";
const router = express.Router();

router.get("/testuser", testUser)
router.get("/testpgsql", testPgsql)
router.post("/testupload",upload.single("images"), testUpload)

export default router