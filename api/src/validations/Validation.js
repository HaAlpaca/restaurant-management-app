import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/apiError.js";
const checkID = async (req, res, next) => {
  const correctCondition = Joi.object({
    id: Joi.number().integer().required(), // Kiểm tra id là số nguyên
  });

  try {
    // Chỉ định abortEarly để nếu có nhiều lỗi thì trả về tất cả lỗi
    await correctCondition.validateAsync(req.params, { abortEarly: false });
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message));
  }
};

export const Validation = {
  checkID,
};
