import baseController from "./_baseController.js";

const Fields = ["status", "description"];
const Controller = baseController("orders", "orders_id", Fields);

export const {
  create: createOrder,
  getById: getOrderById,
  getAll: getAllOrder,
  updateById: updateOrderById,
  deleteById: deleteOrderById,
} = Controller;
