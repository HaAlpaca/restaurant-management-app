import baseController from "./baseController.js";

// Sử dụng base controller cho providers
const tableFields = ["name", "quantity", "location", "status"];
const tableController = baseController("tables", "tables_id", tableFields);
// table
// Table
export const {
  create: createTable,
  getById: getTableById,
  getAll: getAllTable,
  updateById: updateTableById,
  deleteById: deleteTableById,
} = tableController;
