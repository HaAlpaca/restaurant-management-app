import baseController from "./_baseController.js";

const Fields = ["name", "quantity", "phone", "email", "time"];
const Controller = baseController("reservations", "reservations_id", Fields);

export const {
  create: createReservation,
  getById: getReservationById,
  getAll: getAllReservation,
  updateById: updateReservationById,
  deleteById: deleteReservationById,
} = Controller;
