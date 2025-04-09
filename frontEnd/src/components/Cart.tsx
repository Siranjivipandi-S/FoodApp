import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaCartShopping, FaArrowRight, FaTruck } from "react-icons/fa6";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import Navbar from "./Navbar";
import {
  AddtoCart,
  CartItem,
  DeleteCartEvent,
  UpdateCartEvent,
  checkoutEvent,
  selectAllCartItems,
} from "../Redux/CartSlice";
import { RootState } from "../Redux/store";
import { selectAllUsers } from "../Redux/loginslice";
import { ProductsCart } from "./Category/BreakFast";
import { fetchRecommendProduct } from "../Redux/Productslice";
import { Link } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";

function Cart() {
  const [RecommendedProduct, SetRecommendProduct] = useState([]);
  const Carts = useSelector((state: ProductsCart[]) =>
    selectAllCartItems(state)
  );

  useEffect(() => {
    if (Carts.length > 0) {
      getRecommendedProduct();
    }
  }, []);

  const dispatch = useDispatch();
  const [publishableKey, setPublishableKey] = useState("");

  const currentUser = useSelector((state: RootState) => selectAllUsers(state));
  const username = localStorage.getItem("user");
  const useremail = localStorage.getItem("useremail");

  const totalprice = Carts?.reduce((accumulator, currentItem) => {
    return (
      accumulator + currentItem.price * (parseInt(currentItem.quantity) || 1)
    );
  }, 0);

  const ShippingCharges = Carts?.length * 20;
  const TaxCharges = Carts?.length * 3.5;
  const CartPrice = totalprice + ShippingCharges + TaxCharges;
  const [loading, SetLoading] = useState(false);

  async function getRecommendedProduct() {
    try {
      SetLoading(true);
      const response = await dispatch(
        fetchRecommendProduct({
          Carts,
        })
      );
      if (response) {
        SetLoading(false);
        SetRecommendProduct(response.payload);
      }
    } catch (error) {
      SetLoading(false);
      toast.error("Failed to fetch recommended products");
    }
  }

  const CartEvent = async (product: ProductsCart) => {
    try {
      await dispatch(
        AddtoCart({
          id: product.idMeal,
          mealName: product.strMeal,
          mealThumb: product.strMealThumb,
          quantity: 1,
          price: product.price,
        })
      );
      toast.success("Added to cart");
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  useEffect(() => {
    async function fetchKey() {
      const response = await axios.get("http://localhost:5000/getKey");
      setPublishableKey(response.data?.publishableKey);
    }
    fetchKey();
  }, []);

  const handleChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
    id: string
  ) => {
    try {
      await dispatch(UpdateCartEvent({ quantity: e.target.value, id }));
      toast.success("Quantity updated");
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  const removeFromCart = async (id: string) => {
    try {
      await dispatch(DeleteCartEvent(id));
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
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
      await stripe?.redirectToCheckout({ sessionId });
      toast.success("Redirecting to checkout...");
    } catch (error) {
      toast.error("Checkout failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <Navbar />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        }}
      />

      <div className="flex flex-col px-4 md:px-8 lg:px-16 mt-28">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            <span className="text-orange-400">Your</span> Cart
          </h1>
        </div>

        {Carts.length === 0 ? (
          <div className="flex flex-col items-center justify-center mb-8 bg-slate-800 rounded-2xl p-12 shadow-lg mt-20">
            <div className="relative w-32 h-32 mb-6">
              <div className="absolute inset-0 bg-orange-400 rounded-full opacity-20 animate-ping"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FaCartShopping size={64} className="text-orange-400" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Your cart is empty
            </h2>
            <p className="text-slate-400 text-center max-w-md mb-8">
              Looks like you haven't added any items to your cart yet. Explore
              our delicious menu to find something you'll love!
            </p>
            <Link
              to="/"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-medium transition duration-300 flex items-center"
            >
              Browse Menu <FaArrowRight className="ml-2" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
            {/* Cart Items - Takes 2/3 of the grid on large screens */}
            <div className="lg:col-span-2 space-y-6">
              {Carts.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-700 hover:border-orange-500/30"
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative h-20 sm:h-auto sm:w-1/3 overflow-hidden bg-gradient-to-br from-orange-100/90 to-orange-50">
                      <img
                        src={item.mealThumb}
                        alt={item.mealName}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                        <span className="text-white font-bold bg-orange-500 px-3 py-1 rounded-full text-sm">
                          Rs. {item.price}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col justify-between sm:w-2/3">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-2 group">
                          {item.mealName}
                          <span className="block text-sm text-slate-400 mt-1">
                            Premium selection
                          </span>
                        </h2>

                        <div className="flex items-center mt-4 space-x-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-slate-400">Quantity:</span>
                            <div className="relative">
                              <select
                                value={item.quantity}
                                onChange={(e) => handleChange(e, item.id)}
                                className="appearance-none bg-slate-700 text-white px-4 py-2 rounded-lg pr-8 focus:outline-none focus:ring-2 focus:ring-orange-500"
                              >
                                {[1, 2, 3, 4, 5].map((num) => (
                                  <option key={num} value={num}>
                                    {num}
                                  </option>
                                ))}
                              </select>
                              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                <svg
                                  className="h-4 w-4 text-slate-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>

                          <span className="text-white font-medium">
                            Total: Rs.{" "}
                            {item.price * (parseInt(item.quantity) || 1)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-6">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors duration-300"
                        >
                          <FaTrashAlt />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary - Takes 1/3 of the grid on large screens */}
            <div className="lg:col-span-1">
              <div className="bg-slate-800 rounded-2xl shadow-lg border border-slate-700 sticky top-24">
                <div className="p-6">
                  <h2 className="text-3xl font-bold text-white mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Subtotal</span>
                      <span className="text-white font-medium">
                        Rs. {totalprice.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <FaTruck className="text-orange-400 mr-2" />
                        <span className="text-slate-400">Shipping</span>
                      </div>
                      <span className="text-white font-medium">
                        Rs. {ShippingCharges.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Tax</span>
                      <span className="text-white font-medium">
                        Rs. {TaxCharges.toFixed(2)}
                      </span>
                    </div>

                    <div className="border-t border-slate-700 my-4"></div>

                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-white">
                        Total
                      </span>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-orange-400">
                          Rs. {CartPrice.toFixed(2)}
                        </span>
                        <span className="block text-xs text-slate-400 mt-1">
                          Including all taxes
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => checkout(Carts)}
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-xl mt-6 transition-all duration-300 shadow-lg hover:shadow-orange-500/20 flex items-center justify-center"
                    >
                      <span className="mr-2">Proceed to Checkout</span>
                      <FaArrowRight />
                    </button>

                    <p className="text-center text-xs text-slate-400 mt-4">
                      By completing your purchase, you agree to our Terms of
                      Service and Privacy Policy
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recommended Products Section */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          RecommendedProduct &&
          RecommendedProduct.length > 0 && (
            <div className="mt-16 mb-12">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white">
                  Recommended <span className="text-orange-400">For You</span>
                </h2>
                <Link
                  to="/"
                  className="text-orange-400 hover:text-orange-300 transition-colors duration-300 flex items-center"
                >
                  View all <FaArrowRight className="ml-2" />
                </Link>
              </div>

              <div className="relative">
                <div className="flex overflow-x-auto space-x-6 pb-6 no-scrollbar">
                  {RecommendedProduct.map((item) => (
                    <div
                      key={item.idMeal}
                      className="flex-shrink-0 w-72 bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-700 hover:border-orange-500/30 group"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 z-10"></div>
                        <img
                          src={item.strMealThumb}
                          alt={item.strMeal}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full z-20">
                          Recommended
                        </div>
                      </div>

                      <div className="p-4">
                        <h3 className="text-xl font-bold text-white truncate">
                          {item.strMeal}
                        </h3>
                        <p className="text-slate-400 text-sm mt-1">
                          Premium selection
                        </p>

                        <div className="flex items-center justify-between mt-4">
                          <span className="text-xl font-bold text-orange-400">
                            Rs. {item.price}
                          </span>
                          <button
                            onClick={() => CartEvent(item)}
                            className="bg-slate-700 hover:bg-orange-500 text-white p-2 rounded-full transition-colors duration-300"
                          >
                            <FaCartShopping size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default Cart;
