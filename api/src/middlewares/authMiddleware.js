import { StatusCodes } from "http-status-codes";
import { env } from "../config/environment.js";
import { JwtProvider } from "../providers/JwtProvider.js";
import ApiError from "../utils/apiError.js";

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
        next(new ApiError(StatusCodes.FORBIDDEN, "Forbidden! (Access denied)"));
        return;
      }

      // Cho phép tiếp tục nếu hợp lệ
      next();
    } catch (error) {
      // console.log("Error from authMiddleware: ", error);
      if (error.message?.includes("jwt expired")) {
        next(new ApiError(StatusCodes.GONE, "Need to refresh token"));
        return;
      }
      next(
        new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized! (please login)")
      );
    }
  };
};

export const authMiddleware = { isAuthorized };
