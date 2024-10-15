import baseController from "./_baseController.js";

const Fields = [
  "name",
  "address",
  "image_url",
  "phone",
  "email",
  "is_actived",
  "description",
];
const Controller = baseController(
  "providers",
  "providers_id",
  Fields,
  "image_url"
);

export const {
  create: createProvider,
  getById: getProviderById,
  getAll: getAllProvider,
  updateById: updateProviderById,
  deleteById: deleteProviderById,
} = Controller;
