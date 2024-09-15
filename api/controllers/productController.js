import baseController from "./baseController.js";

const productFields = [
  "name",
  "quantity",
  "category",
  "weight",
  "unit",
  "total_price",
  "customer_price",
  "description",
];
const productController = baseController(
  "products",
  "products_id",
  productFields
);
// product
// Product
export const {
  create: createProduct,
  getById: getProductById,
  getAll: getAllProduct,
  updateById: updateProductById,
  deleteById: deleteProductById,
} = productController;
