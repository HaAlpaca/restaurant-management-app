import baseController from "./baseController.js";

const Fields = [
  "name",
  "image_url",
  "quantity",
  "category",
  "weight",
  "unit",
  "total_price",
  "customer_price",
  "description",
];
const Controller = baseController("products", "products_id", Fields,'image_url');
// product
// Product
export const {
  create: createProduct,
  getById: getProductById,
  getAll: getAllProduct,
  updateById: updateProductById,
  deleteById: deleteProductById,
} = Controller;
