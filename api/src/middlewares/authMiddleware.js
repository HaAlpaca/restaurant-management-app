import { StatusCodes } from "http-status-codes";
import { env } from "../config/environment.js";
import { JwtProvider } from "../providers/JwtProvider.js";

// Xác thực và kiểm tra role
const isAuthorized = (allowedRoles = []) => {
  return async (req, res, next) => {
    const accessTokenFromHeader = req.headers.authorization;

    if (!accessTokenFromHeader) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Unauthorized! (Token not found)" });
    }

    try {
      // Giải mã token
      const accessTokenDecoded = await JwtProvider.verifyToken(
        accessTokenFromHeader.substring("Bearer ".length),
        env.ACCESS_TOKEN_SECRET_SIGNATURE
      );

      // Gán giá trị đã giải mã vào req để xử lý phía sau
      req.jwtDecoded = accessTokenDecoded;

      // Kiểm tra role
      const userRole = req.jwtDecoded.role;
      if (!allowedRoles.includes(userRole)) {
        return res
          .status(StatusCodes.FORBIDDEN)
          .json({ message: "Forbidden! (Access denied)" });
      }

      // Cho phép tiếp tục nếu hợp lệ
      next();
    } catch (error) {
      // console.log("Error from authMiddleware: ", error);
      if (error.message?.includes("jwt expired")) {
        return res
          .status(StatusCodes.GONE)
          .json({ message: "Need to refresh token" });
      }
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Unauthorized! (please login)" });
    }
  };
};

export const authMiddleware = { isAuthorized };
