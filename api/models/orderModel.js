import mongoose from "mongoose";

const orderScheme = mongoose.Schema({
  status: String,
  items: [
    {
      itemId: ObjectId,
      quantity: Number,
    },
  ],
  bill: {
    billId: ObjectId,
    // staffId: ObjectId, sau này thêm nhân viên
    total: Number,
    date: Date,
  },
  table: {
    tableId: ObjectId,
  },
});

const Order = mongoose.model("Order", orderScheme);

export default Order;
