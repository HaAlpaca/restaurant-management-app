import baseController from "./baseController.js";

const providerFields = ["name", "address", "phone", "email", "description"];
const providerController = baseController(
  "providers",
  "providers_id",
  providerFields
);

export const {
  create: createProvider,
  getById: getProviderById,
  getAll: getAllProvider,
  updateById: updateProviderById,
  deleteById: deleteProviderById,
} = providerController;
