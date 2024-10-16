import baseController from "./_baseController.js";
const Fields = ["name", "image_url", "unit", "category", "price"];
const Controller = baseController("items", "items_id", Fields, "image_url");
// Item
// item
export const {
  create: createItem,
  getById: getItemById,
  getAll: getAllItem,
  updateById: updateItemById,
  deleteById: deleteItemById,
} = Controller;
