import mongoose from "mongoose";

const tableSchema = mongoose.Schema(
  {
    tableName: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
    },
    location: {
      type: String,
    },
    status: {
      type: String,
    },
    reservations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reservation",
      },
    ],
  },
  { timestamps: true }
)

const Table = mongoose.model("Table", tableSchema);

export default Table;
