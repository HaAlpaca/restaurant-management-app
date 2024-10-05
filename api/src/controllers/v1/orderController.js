import baseController from "./_baseController.js";

const Fields = ["status"];
const Controller = baseController("orders", "orders_id", Fields);

export const {
  create: createOrder,
  getById: getOrderById,
  getAll: getAllOrder,
  deleteById: deleteOrderById,
} = Controller;
