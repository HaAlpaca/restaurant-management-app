import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
    },
    // createdBy: {
    //   type: String,
    // }, for staff
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
  },
  { timestamps: true }
);

const Reservation = mongoose.model("Reservation", reservationSchema);

export default Reservation;
