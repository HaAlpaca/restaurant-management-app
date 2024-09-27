import baseController from "./_baseController.js";

const Fields = ["status"];
const Controller = baseController("orders", "orders_id", Fields);
// Order
// order
export const {
  create: createOrder,
  getById: getOrderById,
  getAll: getAllOrder,
  updateById: updateOrderById,
  deleteById: deleteOrderById,
} = Controller;
