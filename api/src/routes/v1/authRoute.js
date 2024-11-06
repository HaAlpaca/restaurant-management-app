import express from "express";
import { authController } from "../../controllers/v1/auth/authController.js";

const Router = express.Router();
// API đăng nhập.
Router.route("/login").post(authController.login);

// API đăng xuất.
Router.route("/logout").delete(authController.logout);

// API Refresh Token - Cấp lại Access Token mới.
Router.route("/refresh_token").put(authController.refreshToken);

export const authRoute = Router;
