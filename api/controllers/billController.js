import baseController from "./baseController.js";

// Sử dụng base controller cho providers
const billController = baseController("bill", "bill_id");
// Bill
// bill
export const {
  create: createBill,
  getById: getBillById,
  getAll: getAllBill,
  updateById: updateBillById,
  deleteById: deleteBillById,
} = billController;
