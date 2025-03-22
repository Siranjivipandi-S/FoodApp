const asyncHandler = require("express-async-handler");

import { Request, Response } from "express";
import { CartCheckout } from "../model/CheckoutModel";

const allTransaction = asyncHandler(async (req: Request, res: Response) => {
  try {
    const transaction = await CartCheckout.find();
    res.status(200).json(transaction);
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

export { allTransaction };
