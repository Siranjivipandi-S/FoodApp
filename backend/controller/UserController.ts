import { Request, Response, NextFunction } from "express";
import { CartModel } from "../model/CartModel";
const asyncHandler = require("express-async-handler");
interface CreateItemRequest extends Request {
  body: {
    id: string;
    mealName: string;
    quantity: number;
    price: number;
    mealThumb: string;
  };
}

const CreateItem = asyncHandler(
  async (req: CreateItemRequest, res: Response, next: NextFunction) => {
    const { id, mealName, quantity, price, mealThumb } = req.body;
    if (!id || !mealName || !quantity || !price || !mealThumb) {
      return res.status(400).json({ message: "All fields are required" });
    }
    try {
      await CartModel.insertMany({
        id: id,
        mealName: mealName,
        quantity: quantity,
        price: price,
        mealThumb: mealThumb,
      });
      res.status(201).json({
        id: id,
        mealName: mealName,
        quantity: quantity,
        price: price,
        mealThumb: mealThumb,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);
const DeleteItemfromCart = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ message: "Id is mandatory" });
    }

    try {
      const response = await CartModel.findByIdAndDelete(id);
      if (!response) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

module.exports = { CreateItem, DeleteItemfromCart };
