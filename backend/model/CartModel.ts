import mongoose, { Document } from "mongoose";

export interface CartItemType extends Document {
  id: string;
  mealName: string;
  quantity: number;
  price: number;
  mealThumb: string;
}
const Cart = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  mealName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  mealThumb: {
    type: String,
    required: true,
  },
});

export const CartModel = mongoose.model<CartItemType>("Cart", Cart);
