import { StatusCodes } from "http-status-codes";
import { env } from "../../../config/environment.js";
import { JwtProvider } from "../../../providers/JwtProvider.js";
import { pool } from "../../../config/db.js";
import bcrypt from "bcrypt";
const login = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Kiểm tra email hoặc username từ bảng Staff
    const query = `
        SELECT * FROM Staff 
        WHERE (email = $1 OR username = $2) 
        LIMIT 1
      `;
    const values = [email, username];
    const { rows } = await pool.query(query, values);
    const user = rows[0];
    // Nếu không tìm thấy người dùng
    if (!user) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: "Your email/username or password is incorrect" });
    }
    // if (!user) {
    //   return res
    //     .status(StatusCodes.FORBIDDEN)
    //     .json({ message: "Your email/username or password is incorrect!" });
    // }

    // Kiểm tra password bằng cách so sánh password_hash
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: "Your email/username or password is incorrect!" });
    }

    // Tạo token và trả về cho phía Client nếu thông tin tài khoản đúng
    const userInfo = {
      id: user.staff_id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    // Tạo accessToken và refreshToken
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      // 20
      "1h"
    );
    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      env.REFRESH_TOKEN_SECRET_SIGNATURE,
      "14 days"
    );

    // Trả về token cho FE lưu vào localStorage
    res.status(StatusCodes.OK).json({
      ...userInfo,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
};

const logout = async (req, res) => {
  try {
    // Do something
    // xoa cookie don gian lam nguoc lai
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(StatusCodes.OK).json({ message: "Logout API success!" });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const refreshToken = async (req, res) => {
  try {
    const refreshTokenFromBody = req.body?.refreshToken;
    // verify refreshtoken co hop le khong
    const refreshTokenDecoded = await JwtProvider.verifyToken(
      //   accessTokenFromCookie,
      refreshTokenFromBody,
      env.REFRESH_TOKEN_SECRET_SIGNATURE
    );
    // lay thong tin tu decoded
    const userInfo = {
      id: refreshTokenDecoded.id,
      email: refreshTokenDecoded.email,
      username: refreshTokenDecoded.username,
      role: refreshTokenDecoded.role,
    };
    // tao accesstoken moi
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      // 20
      "1h"
    );
    // tra ve access token trong response de dinh vao localstorage
    res.status(StatusCodes.OK).json({ accessToken });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Generate refresh token failed" });
  }
};


export const authController = { refreshToken, logout, login };
