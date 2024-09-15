import express from "express";
import {
  testUser,
  testUpload,
  testPgsql,
} from "../../controllers/demo/demoController.js";
import upload from "../../middlewares/upload.js";
const router = express.Router();

router.get("/testuser", testUser);
router.get("/testpgsql", testPgsql);
router.post("/testupload", upload.single("image"), testUpload);

export default router;
