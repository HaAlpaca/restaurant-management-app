import baseController from "./baseController.js";

// Sử dụng base controller cho providers
const Fields = ["name", "quantity", "location", "status"];
const Controller = baseController("tables", "tables_id", Fields);
// table
// Table
export const {
  create: createTable,
  getById: getTableById,
  getAll: getAllTable,
  updateById: updateTableById,
  deleteById: deleteTableById,
} = Controller;
