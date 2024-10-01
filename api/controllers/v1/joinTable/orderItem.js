import joinTable2Service from "../../../services/joinTable2Service.js";
import joinTableBase2Controller from "./_joinTableBase2Controller.js";

// Khởi tạo joinTableService cho bảng liên kết giữa reservations và tables
const orderItemService = joinTable2Service(
  "orders_items",
  "orders",
  "items",
  "orders_id",
  "items_id"
);

// Khởi tạo các phương thức controller dựa trên joinTableBaseController
const orderItemController = joinTableBase2Controller(
  orderItemService,
  "order", // Tên bảng đơn (số ít)
  "items" // Tên bảng số nhiều (số nhiều)
);

// Sử dụng cú pháp destructuring để xuất tất cả các phương thức cùng một lúc
export const {
  addEntries: addItemToOrder,
  getEntries: getItemfromOrder,
  updateEntries: updateItemForOrder,
  deleteEntries: deleteItemFromOrder,
} = orderItemController;
