import { Request, Response } from "express";
import { CartCheckout } from "../model/CheckoutModel";
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const asyncHandler = require("express-async-handler");
import { MealDb } from "../model/ProductModel";
import { spawn } from "child_process";
import path from "path";
import data from "../data/data.json";
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

const recommendProducts = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { cart } = req.body;
    const cartData = cart?.Carts;
    console.log(cartData, "cart");

    // Validate cart input
    if (!cart || cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Fetch products from MongoDB
    const products = await MealDb.find();

    // Resolve the path to the Python script
    const pythonScript = path.resolve(
      __filename,
      "../../src/python/recommendation.py"
    );

    const formattedPath = pythonScript.replace(/\\/g, "/");
    console.log(formattedPath, "formated");

    // Spawn the Python process
    const python = spawn("python", [formattedPath]);

    // Prepare input data for the Python script
    const inputData = JSON.stringify({ cartData, products });
    // console.log("Input Data to Python:", inputData);

    // Send data to the Python script
    python.stdin.write(inputData);
    python.stdin.end();

    let data = "";
    let errorData = "";

    // Capture stdout (data) from the Python script
    python.stdout.on("data", (chunk) => {
      data += chunk.toString();
      console.log("Raw Python Output:", chunk.toString()); // Log raw output
    });

    // Capture stderr (errors) from the Python script
    python.stderr.on("data", (chunk) => {
      errorData += chunk.toString();
      console.error("Python Error Output:", chunk.toString()); // Log Python errors
    });

    // Handle the Python process completion
    python.on("close", (code) => {
      if (code === 0) {
        try {
          // Validate that data is not empty
          if (!data) {
            throw new Error("No data received from Python script");
          }

          // Parse the JSON output from the Python script
          const recommendations = JSON.parse(data);
          console.log(recommendations, "Recommendations");

          // Send the recommendations back to the client
          res.json(recommendations);
        } catch (jsonError) {
          console.error("JSON Parse  Error:", jsonError);
          console.error("Raw Data:", data); // Log the raw data that caused the error
          if (jsonError instanceof Error) {
            res.status(500).json({
              message: "Failed to parse recommendations",
              error: jsonError.message,
            });
          } else {
            res.status(500).json({
              message: "Failed to parse recommendations",
              error: "An unknown error occurred",
            });
          }
        }
      } else {
        // Handle Python script errors
        console.error("Python Error:", errorData);
        res.status(500).json({
          message: "Python process failed",
          error: errorData,
        });
      }
    });
  } catch (error: unknown) {
    // Handle unexpected errors in the Node.js controller
    if (error instanceof Error) {
      res.status(500).json({
        message: `Failed to fetch products: ${error.message}`,
      });
    } else {
      res.status(500).json({
        message: "An unknown error occurred while fetching products.",
      });
    }
  }
});

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
          currency: "inr", // Correct currency code for Indian Rupees
          product_data: {
            name: item.mealName,
          },
          unit_amount: item.price * 100, // Stripe requires amount in paise (1 INR = 100 paise)
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

const stripeWebhookHandler = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!; // Set in .env

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      const { username, email, totalprice, cartItems } = session.metadata || {};

      if (!username || !email || !totalprice || !cartItems) {
        console.error("Missing metadata in webhook session.");
        return res.status(400).json({ message: "Invalid session metadata" });
      }

      const newCart = new CartCheckout({
        username,
        email,
        cartItems: JSON.parse(cartItems),
        totalprice,
        paymentStatus: "Paid",
        stripeSessionId: session.id,
      });

      await newCart.save();
      console.log("Transaction saved successfully!");
    } catch (err) {
      console.error("Error saving transaction:", err);
    }
  }

  res.json({ received: true });
};

export {
  checkoutCart,
  getPublishablekey,
  stripeWebhookHandler,
  recommendProducts,
};
