import { Router } from "express";
import authMiddleware from "../middlewares/AuthMiddleware";
const router = Router();
const {
  CreateItem,
  DeleteItemfromCart,
} = require("../controller/UserController");
const {
  checkoutCart,
  checkoutCartEvent,
  getPublishablekey,
} = require("../controller/CartCheckout");
const { signupUser, loginUser } = require("../controller/LoginController");
router.post("/login", loginUser);
router.post("/signup", signupUser);
router.post("/createCart", authMiddleware, CreateItem);
router.delete("/deleteCart/:id", DeleteItemfromCart);
router.post("/checkout", checkoutCart);
router.get("/getKey", getPublishablekey);
// router.post("/checkoutEvent", checkoutCartEvent);

export default router;
