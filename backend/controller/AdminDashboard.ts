import { NextFunction, Request, Response } from "express";
import { CartCheckout } from "../model/CheckoutModel";
import asyncHandler from "express-async-handler";
import { log } from "node:console";
import { LogError } from "concurrently";

// Paginate transactions
const allTransaction = asyncHandler(async (req: Request, res: Response) => {
  try {
    const transactions = await CartCheckout.find();

    // Send response with paginated data
    res.status(200).json({
      transactions,
    });
  } catch (error) {
    res.status(400).json({ message: error });
  }
});
const OrderTransaction = asyncHandler(async (req: Request, res: Response) => {
  try {
    // Get page and limit from query parameters (with defaults)
    const page: number = parseInt(req.query.page as string) || 1; // Default to page 1
    const limit: number = parseInt(req.query.limit as string) || 5; // Default to 5 items per page
    const skip: number = (page - 1) * limit; // Skip based on current page

    // Get total count of transactions
    const totalItems = await CartCheckout.countDocuments();

    // Find the transactions with pagination and sorting by creation date (most recent first)
    const transactions = await CartCheckout.find()
      .sort({ createdAt: -1 }) // Sort by creation date, descending
      .skip(skip)
      .limit(limit);

    // Send response with paginated data
    res.status(200).json({
      transactions,
      totalItems,
    });
  } catch (error) {
    res.status(400).json({ message: error });
  }
});
const GetUserOrderTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get page, limit, and email from query parameters
    const page: number = parseInt(req.query.page as string) || 1; // Default to page 1
    const userMail: string = req.query.email as string; // Corrected to get the email
    const limit: number = parseInt(req.query.limit as string) || 5; // Default to 5 items per page
    const skip: number = (page - 1) * limit; // Skip based on current page

    // Check if userMail is provided
    if (!userMail) {
      return res.status(400).json({ message: "Email is required" }); // Send response if email is missing
    }

    // Find the transactions for the specified user with pagination and sorting by creation date (most recent first)
    const transactions = await CartCheckout.find({
      email: userMail,
    })
      .sort({ createdAt: -1 }) // Sort by creation date, descending
      .skip(skip)
      .limit(limit);

    // If no transactions found, send an appropriate message
    if (transactions.length === 0) {
      return res
        .status(404)
        .json({ message: "No transactions found for this user." });
    }

    // Find the total number of transactions to calculate total pages
    const totalItems = await CartCheckout.countDocuments({
      email: userMail,
    });

    // Send response with paginated data and totalItems for pagination calculation
    return res.status(200).json({
      transactions,
      totalItems,
    });
  } catch (error: any) {
    // Explicitly type the error as any
    // Pass error to next middleware for centralized error handling
    next(error);
  }
};

export { allTransaction, OrderTransaction, GetUserOrderTransaction };
