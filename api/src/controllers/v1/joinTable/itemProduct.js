import joinTableService from "../../../services/joinTableService.js";
import joinTableBaseController from "./_joinTableBaseController.js";

// Khởi tạo joinTableService cho bảng liên kết giữa reservations và tables
const itemProductService = joinTableService(
  "products_items",
  "items",
  "products",
  "items_id",
  "products_id"
);

// Khởi tạo các phương thức controller dựa trên joinTableBaseController
const itemProductController = joinTableBaseController(
  itemProductService,
  "item", // Tên bảng đơn (số ít)
  "products" // Tên bảng số nhiều (số nhiều)
);

// Sử dụng cú pháp destructuring để xuất tất cả các phương thức cùng một lúc
export const {
  addEntries: addProductToItem,
  getEntries: getProductfromItem,
  updateEntries: updateProductForItem,
  deleteEntries: deleteProductFromItem,
} = itemProductController;
