import baseController from "./baseController.js";

// Sử dụng base controller cho providers
const Fields = ["total", "orders_id", "staff_id"];
const Controller = baseController("bill", "bill_id", Fields);
// Bill
// bill
export const {
  create: createBill,
  getById: getBillById,
  getAll: getAllBill,
  updateById: updateBillById,
  deleteById: deleteBillById,
} = Controller;
