import baseController from "./baseController.js";

const Fields = ["name", "address", "phone", "email", "description"];
const Controller = baseController("providers", "providers_id", Fields,'image_url');

export const {
  create: createProvider,
  getById: getProviderById,
  getAll: getAllProvider,
  updateById: updateProviderById,
  deleteById: deleteProviderById,
} = Controller;
