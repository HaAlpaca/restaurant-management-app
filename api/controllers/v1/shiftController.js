import baseController from "./_baseController.js";

const Fields = ["name", "start_time", "end_time"];
const Controller = baseController("shift", "shift_id", Fields);

export const {
  create: createShift,
  getById: getShiftById,
  getAll: getAllShift,
  updateById: updateShiftById,
  deleteById: deleteShiftById,
} = Controller;
