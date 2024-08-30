import mongoose from "mongoose";

const itemModel = mongoose.Schema({
    _id: ObjectId,
    name: String,
    unit: String,
    ingredients: [{
        ingredient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ingredient'
        },
        quantity: Number,
        unit: String
    }]
});

const Item = mongoose.model("Item", itemModel);

export default Item;
