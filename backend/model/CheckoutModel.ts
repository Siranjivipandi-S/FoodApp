import mongoose, { Document, Schema } from "mongoose";

export interface CartItemType extends Document {
  id: string;
  mealName: string;
  quantity: number;
  price: number;
  mealThumb: string;
}

const CartItemSchema = new Schema<CartItemType>({
  id: { type: String, required: true },
  mealName: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  mealThumb: { type: String, required: true },
});

export interface CartCheckoutType extends Document {
  username: string;
  email: string;
  totalprice: number;
  cartItems: CartItemType[];
}

const CartCheckoutSchema = new Schema<CartCheckoutType>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    totalprice: { type: Number, required: true },
    cartItems: { type: [CartItemSchema], required: true },
  },
  { timestamps: true }
);

const CartCheckout = mongoose.model<CartCheckoutType>(
  "CartCheckout",
  CartCheckoutSchema
);

export { CartCheckout };
