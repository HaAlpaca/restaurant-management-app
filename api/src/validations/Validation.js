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

// Xác thực cho Providers
const validateProvider = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().max(50).required(),
    image_url: Joi.string().uri().optional(),
    address: Joi.string().optional(),
    phone: Joi.string().max(50).optional(),
    email: Joi.string().email().max(50).optional(),
    description: Joi.string().optional(),
    is_actived: Joi.boolean().optional(),
  });

  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message));
  }
};

// Xác thực cho Products
const validateProduct = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().max(100).required(),
    image_url: Joi.string().uri().optional(),
    color: Joi.string().max(20).optional(),
    quantity: Joi.number().optional(),
    category: Joi.string().max(50).optional(),
    weight: Joi.number().optional(),
    unit: Joi.string().max(20).optional(),
    customer_price: Joi.number().optional(),
    description: Joi.string().optional(),
  });

  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message));
  }
};

// Xác thực cho Transactions
const validateTransaction = async (req, res, next) => {
  const schema = Joi.object({
    staff_id: Joi.number().integer().optional(),
    providers_id: Joi.number().integer().optional(),
    products_id: Joi.number().integer().optional(),
    status: Joi.string().max(50).optional(),
    name: Joi.string().max(50).optional(),
    quantity: Joi.number().optional(),
    unit: Joi.string().max(20).optional(),
    price: Joi.number().optional(),
    description: Joi.string().optional(),
  });

  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message));
  }
};

// Xác thực cho Items
const validateItem = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().max(50).required(),
    image_url: Joi.string().uri().optional(),
    unit: Joi.string().max(20).optional(),
    category: Joi.string().max(50).optional(),
    price: Joi.number().required(),
  });

  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message));
  }
};

// Xác thực cho Orders
const validateOrder = async (req, res, next) => {
  const schema = Joi.object({
    status: Joi.string().max(20).optional(),
  });

  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message));
  }
};

// Xác thực cho Bill
const validateBill = async (req, res, next) => {
  const schema = Joi.object({
    total: Joi.number().required(),
    orders_id: Joi.number().integer().optional(),
    staff_id: Joi.number().integer().optional(),
  });

  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message));
  }
};

// Xác thực cho Tables
const validateTable = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().max(20).optional(),
    quantity: Joi.number().integer().optional(),
    location: Joi.string().optional(),
    status: Joi.string().optional(),
  });

  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message));
  }
};

// Xác thực cho Reservations
const validateReservation = async (req, res, next) => {
  const schema = Joi.object({
    quantity: Joi.number().integer().optional(),
    name: Joi.string().max(50).optional(),
    phone: Joi.string().max(50).optional(),
    email: Joi.string().email().max(50).optional(),
    status: Joi.string().optional(),
    time: Joi.date().optional(),
  });

  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message));
  }
};

// Xác thực cho Staff
const validateStaff = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().max(50).optional(),
    birthday: Joi.date().optional(),
    image_url: Joi.string().uri().optional(),
    phone: Joi.string().max(50).optional(),
    citizen_id: Joi.string().max(50).optional(),
    role: Joi.string().max(50).optional(),
    salary: Joi.number().optional(),
    wage: Joi.number().optional(),
    username: Joi.string().max(50).optional(),
    password_hash: Joi.string().optional(),
    email: Joi.string().email().max(50).optional(),
    email_verified: Joi.boolean().optional(),
  });

  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message));
  }
};

// Xác thực cho Shift
const validateShift = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().max(50).optional(),
    start_time: Joi.string().optional(),
    end_time: Joi.string().optional(),
  });

  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message));
  }
};

export const Validation = {
  checkID,
  validateProvider,
  validateProduct,
  validateTransaction,
  validateItem,
  validateOrder,
  validateBill,
  validateTable,
  validateReservation,
  validateStaff,
  validateShift,
};
