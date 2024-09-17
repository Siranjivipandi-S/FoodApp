import { Request, Response, NextFunction } from "express";
import UserModel from "../model/userModel";
const jwt = require("jsonwebtoken");

interface AuthenticatedRequest extends Request {
  user?: any;
}

const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer", "");
  console.log(token);

  if (!token) {
    return res
      .status(401)
      .json({ message: "No token provided, authorization denied" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };
    console.log(decoded);

    req.user = await UserModel.findById(decoded.id).select("-password");
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "User not found, authorization denied" });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default authMiddleware;
