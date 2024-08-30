import mongoose from "mongoose";

const ingredientModel = mongoose.Schema({
    _id: ObjectId,
    name: String,
    quantity: Number,
    category: String,
    weight: Number,
    unit: String,
    // totalPrice: Number, cái này sẽ dùng trong kho hàng
    customerPrice: Number
});

const Ingredient = mongoose.model("Ingredient", ingredientModel);

export default Ingredient;
