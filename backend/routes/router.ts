import { Router } from "express";
import authMiddleware from "../middlewares/AuthMiddleware";
import bodyParser from "body-parser";

const router = Router();
const {
  CreateItem,
  DeleteItemfromCart,
} = require("../controller/UserController");
const {
  checkoutCart,
  getPublishablekey,
  recommendProducts,
  recommendUserLikedProducts,
  stripeWebhookHandler,
} = require("../controller/CartCheckout");
const { signupUser, loginUser } = require("../controller/LoginController");
const {
  allTransaction,
  OrderTransaction,
  GetUserOrderProducts,
  GetUserOrderTransaction,
  GetUserOrderTransactionCount,
} = require("../controller/AdminDashboard");

router.post("/login", loginUser);
router.post("/signup", signupUser);
router.post("/createCart", authMiddleware, CreateItem);
router.delete("/deleteCart/:id", DeleteItemfromCart);
router.post("/checkout", checkoutCart);
router.get("/getKey", getPublishablekey);
router.get("/gettransaction", allTransaction);
router.get("/Ordertransaction", OrderTransaction);
router.get("/OrderProducts", GetUserOrderProducts);
router.get("/UserProductCount", GetUserOrderTransactionCount);
router.get("/MyOrders", GetUserOrderTransaction);
router.post("/recommendproduct", recommendProducts);
router.post("/userFrequentProduct", recommendUserLikedProducts);
router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  stripeWebhookHandler // Stripe requires raw body
);

// router.post("/checkoutEvent", checkoutCartEvent);

export default router;
