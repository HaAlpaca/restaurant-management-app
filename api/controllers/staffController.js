import baseController from "./baseController.js";

const Fields = [
  "name",
  "birthday",
  "image_url",
  "phone",
  "citizen_id",
  "role",
  "salary",
  "wage",
];
const Controller = baseController("staff", "staff_id", Fields);

export const {
  create: createStaff,
  getById: getStaffById,
  getAll: getAllStaff,
  updateById: updateStaffById,
  deleteById: deleteStaffById,
} = Controller;
