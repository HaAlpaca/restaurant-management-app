import baseController from "./baseController.js";

const reservationFields = ["name", "quantity", "phone", "email", "time"];
const reservationController = baseController(
  "reservations",
  "reservations_id",
  reservationFields
);

export const {
  create: createReservation,
  getById: getReservationById,
  getAll: getAllReservation,
  updateById: updateReservationById,
  deleteById: deleteReservationById,
} = reservationController;
