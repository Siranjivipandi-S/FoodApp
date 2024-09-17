import { Request, Response, NextFunction } from "express";

import UserModel, { IUser } from "../model/userModel";

const asyncHandler = require("express-async-handler");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const dotenv = require("dotenv").config();

const signupUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser: IUser = new UserModel({
    email,
    password: hashedPassword,
    username,
  });

  await newUser.save();

  res.status(201).json({ message: "User created successfully" });
});
const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  const { _id, username } = user;
  res.status(200).json({ _id, username, email: user.email, token });
});

module.exports = { signupUser, loginUser };
