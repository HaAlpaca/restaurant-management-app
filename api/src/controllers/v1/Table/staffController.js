import baseController from "./_baseController.js";

const Fields = [
  "name",
  "birthday",
  "image_url",
  "phone",
  "citizen_id",
  "role",
  "salary",
  "wage",
  "username",
  "password_hash",
  "email",
];
const Controller = baseController("staff", "staff_id", Fields, "image_url");

export const {
  create: createStaff,
  getById: getStaffById,
  getAll: getAllStaff,
  updateById: updateStaffById,
  deleteById: deleteStaffById,
} = Controller;
