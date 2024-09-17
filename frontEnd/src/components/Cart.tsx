import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaCartShopping } from "react-icons/fa6";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import Navbar from "./Navbar";
import {
  CartItem,
  DeleteCartEvent,
  UpdateCartEvent,
  checkoutEvent,
  selectAllCartItems,
} from "../Redux/CartSlice";
import { RootState } from "../Redux/store";
import { selectAllUsers } from "../Redux/loginslice";
import { ProductsCart } from "./Category/BreakFast";

function Cart() {
  const Carts = useSelector((state: ProductsCart[]) =>
    selectAllCartItems(state)
  );
  const [publishableKey, setPublishableKey] = useState("");
  const currentUser = useSelector((state: RootState) => selectAllUsers(state));
  const username = currentUser ? currentUser[0]?.username : null;
  const useremail = currentUser ? currentUser[0]?.email : null;

  const totalprice = Carts?.reduce((accumulator, currentItem) => {
    return accumulator + currentItem.price * currentItem.quantity;
  }, 0);
  const ShippingCharges = Carts?.length * 20;
  const TaxCharges = Carts?.length * 3.5;
  const CartPrice = totalprice + ShippingCharges + TaxCharges;

  useEffect(() => {
    async function fetchKey() {
      const response = await axios.get("http://localhost:5000/getKey");
      setPublishableKey(response.data?.publishableKey);
    }
    fetchKey();
  }, []);

  const dispatch = useDispatch();

  const handleChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
    id: string
  ) => {
    try {
      await dispatch(UpdateCartEvent({ quantity: e.target.value, id }));
    } catch (error) {
      console.log(error);
    }
  };

  const removeFromCart = async (id: string) => {
    try {
      await dispatch(DeleteCartEvent(id));
      toast.success("Product removed from cart successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const checkout = async (products: CartItem[]) => {
    try {
      const stripe = await loadStripe(publishableKey);
      const response = await dispatch(
        checkoutEvent({
          product: products,
          username,
          email: useremail,
          totalprice: CartPrice,
        })
      );
      const sessionId = response?.payload?.id;
      console.log("Session ID:", sessionId);
      await stripe?.redirectToCheckout({ sessionId });
      toast.success("Redirecting to Stripe Checkout...");
    } catch (error) {
      console.log(error);
      toast.error("Error during checkout. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-900">
      <div className="flex flex-col">
        <Navbar />
        <Toaster />
        <div className="flex flex-col mt-20">
          <h1 className="text-5xl text-orange-400 text-center mt-8 hover:scale-105 transition-transform">
            Cart Section
          </h1>
          <div className="flex-grow container h-full mt-10 mb-10 flex items-start justify-center">
            <div className="flex w-full ml-10">
              <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 w-fit gap-5 ml-8">
                {Carts && Carts.length > 0 ? (
                  Carts.map((item) => (
                    <div
                      className="bg-slate-800 h-[340px] w-[300px] mb-3 rounded-xl relative shadow-lg overflow-hidden"
                      key={item.id}
                    >
                      <div className="absolute bg-orange-100 h-[200px] w-[370px] rounded-bl-full -left-14">
                        <div className="flex items-center justify-center mt-2">
                          <img
                            src={item.mealThumb}
                            alt={item.mealName}
                            className="ml-5 rounded-full h-44 w-52 hover:scale-110 transition-transform select-none"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col z-20 mt-56 ml-4 gap-4">
                        <div className="flex items-center justify-between">
                          <h2 className="text-2xl text-green-300 select-none">
                            {`${item.mealName?.slice(0, 10)}..`}
                          </h2>
                          <div className="flex -ml-5">
                            <label htmlFor="quantity" className="text-white">
                              Quantity
                            </label>
                            <select
                              onChange={(e) => handleChange(e, item.id)}
                              id="quantity"
                              className="bg-slate-800 text-white outline-none border-none ml-2"
                            >
                              <option value="1" className="text-white">
                                1
                              </option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-lg text-white select-none">
                            Rs. {item.price}
                          </p>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="select-none flex font-medium items-center gap-2 mr-5 bg-red-500 text-white rounded-full p-2 hover:bg-orange-300 hover:scale-105 transition-transform"
                          >
                            Remove
                            <FaCartShopping size={20} color="white" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <h1 className="text-4xl text-center text-white">
                    No Items in Cart
                  </h1>
                )}
              </div>
              <div className="fixed bg-slate-800 ml-[1090px] h-[414px] w-[370px] rounded-xl p-4">
                <h1 className="text-4xl text-blue-600 text-start mt-5">
                  Order summary
                </h1>
                <div className="flex flex-col gap-5 mt-7">
                  <div className="flex items-center justify-between ml-2">
                    <p className="text-white text-lg">Sub Total</p>
                    <p className="text-white text-lg">Rs. {totalprice}</p>
                  </div>
                  <hr />
                  <div className="flex items-center justify-between ml-2">
                    <p className="text-white text-lg">Shipping estimate</p>
                    <p className="text-white text-lg">Rs. {ShippingCharges}</p>
                  </div>
                  <hr />
                  <div className="flex items-center justify-between ml-2">
                    <p className="text-white text-lg">Tax estimate</p>
                    <p className="text-white text-lg">Rs. {TaxCharges}</p>
                  </div>
                  <hr />
                  <div className="flex items-center justify-between ml-2">
                    <p className="font-bold text-white text-xl">Order Total</p>
                    <p className="text-white font-bold text-xl">
                      Rs. {CartPrice}
                    </p>
                  </div>
                  <div className="block">
                    <button
                      onClick={() => checkout(Carts)}
                      className="bg-blue-800 font-medium p-3 w-full rounded-lg text-white hover:bg-blue-900 hover:font-normal transition-colors"
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
