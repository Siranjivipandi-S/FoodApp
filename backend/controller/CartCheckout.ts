import { Request, Response } from "express";
import { CartCheckout } from "../model/CheckoutModel";
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const asyncHandler = require("express-async-handler");

interface CreateItemRequest extends Request {
  body: {
    username: string;
    email: string;
    totalprice: number;
    cartItems: Array<{
      id: string;
      mealName: string;
      quantity: number;
      price: number;
      mealThumb: string;
    }>;
  };
}

const getPublishablekey = asyncHandler(async (req: Request, res: Response) => {
  try {
    const publishableKey = process.env.STRIPE_PUBLISH_KEY;
    if (!publishableKey) {
      return res.status(500).json({ message: "Publishable key not found" });
    }
    return res.status(200).json({ publishableKey });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
});

const checkoutCart = asyncHandler(
  async (req: CreateItemRequest, res: Response) => {
    const { username, email, cartItems, totalprice } = req.body;

    if (
      !username ||
      !email ||
      !cartItems ||
      !totalprice ||
      !Array.isArray(cartItems) ||
      cartItems.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Username, email, and cart items are required" });
    }

    try {
      const lineItems = cartItems.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.mealName,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      }));

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `http://localhost:5173/success`,
        cancel_url: `http://localhost:5173/cancel`,
      });
      if (session) {
        const newCart = new CartCheckout({
          username,
          email,
          cartItems,
          totalprice,
        });
        await newCart.save();
      }

      console.log("Stripe session created:", session.id); // Log the session ID
      res
        .status(201)
        .json({ message: "Cart items successfully stored", id: session.id });
    } catch (error) {
      console.error("Error creating Stripe session:", error); // Log any errors
      res.status(500).json({ message: "Internal Server Error", error });
    }
  }
);

export { checkoutCart, getPublishablekey };
