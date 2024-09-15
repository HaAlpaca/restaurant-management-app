import baseController from "./baseController.js";

const itemFields = ["name", "quantity", "unit", "category", "price"];
const itemController = baseController("items", "items_id", itemFields);
// Item
// item
export const {
  create: createItem,
  getById: getItemById,
  getAll: getAllItem,
  updateById: updateItemById,
  deleteById: deleteItemById,
} = itemController;
