import baseController from "./baseController.js";

const orderFields = ["status"];
const orderController = baseController("orders", "orders_id", orderFields);
// Order
// order
export const {
  create: createOrder,
  getById: getOrderById,
  getAll: getAllOrder,
  updateById: updateOrderById,
  deleteById: deleteOrderById,
} = orderController;
