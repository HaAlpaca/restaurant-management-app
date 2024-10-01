import joinTableService from "../../../services/joinTableService.js";
import joinTableBaseController from "./_joinTableBaseController.js";

// Khởi tạo joinTableService cho bảng liên kết giữa reservations và tables
const tableOrderService = joinTableService(
  "orders_tables",
  "tables",
  "orders",
  "tables_id",
  "orders_id"
);

// Khởi tạo các phương thức controller dựa trên joinTableBaseController
const tableOrderController = joinTableBaseController(
  tableOrderService,
  "table", // Tên bảng đơn (số ít)
  "orders" // Tên bảng số nhiều (số nhiều)
);

// Sử dụng cú pháp destructuring để xuất tất cả các phương thức cùng một lúc
export const {
  addEntries: addOrderToTable,
  getEntries: getOrderfromTable,
  updateEntries: updateOrderForTable,
  deleteEntries: deleteOrderFromTable,
} = tableOrderController;
