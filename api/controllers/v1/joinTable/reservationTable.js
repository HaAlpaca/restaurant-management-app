import joinTableService from "../../../services/joinTableService.js";
import joinTableBaseController from "./_joinTableBaseController.js";

// Khởi tạo joinTableService cho bảng liên kết giữa reservations và tables
const reservationTableService = joinTableService(
  "tables_reservations",
  "reservations",
  "tables",
  "reservations_id",
  "tables_id"
);

// Khởi tạo các phương thức controller dựa trên joinTableBaseController
const reservationTableController = joinTableBaseController(
  reservationTableService,
  "reservation", // Tên bảng đơn (số ít)
  "tables" // Tên bảng số nhiều (số nhiều)
);

// Sử dụng cú pháp destructuring để xuất tất cả các phương thức cùng một lúc
export const {
  addEntries: addTableToReservation,
  getEntries: getTablefromReservation,
  updateEntries: updateTableForReservation,
  deleteEntries: deleteTableFromReservation,
} = reservationTableController;
