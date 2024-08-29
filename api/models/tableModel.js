import mongoose from "mongoose";

const tableSchema = mongoose.Schema({
  _id: ObjectId,
  tableName: String,
  quantity: Number,
  location: String,
  status: Boolean,
  reservations: [
    {
      reservationId: ObjectId,
    },
  ],
});

const Table = mongoose.model("Table", tableSchema);

export default Table;
