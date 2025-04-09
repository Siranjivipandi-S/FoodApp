import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  UserRecommendProduct,
  selectAllUserProducts,
} from "../Redux/Productslice";
import { Link } from "react-router-dom";
import { FaCartShopping, FaStar, FaRegClock } from "react-icons/fa6";
import { IoFlame } from "react-icons/io5";
import { AddtoCart } from "../Redux/CartSlice";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

// Interfaces
interface CartItem {
  id: string;
  mealName: string;
  quantity: number;
  price: number;
  mealThumb: string;
}

interface ProcessedCartItem extends CartItem {
  totalQuantity: number;
}

interface ProductsCart {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  price: number;
  totalQuantity?: number;
}

function FrequentProducts() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const userMail = localStorage.getItem("useremail");

  const mostPurchased: ProductsCart[] = useSelector(selectAllUserProducts);
  const [userFrequent, SetUserFrequent] = useState([]);

  useEffect(() => {
    const getTransactionData = async () => {
      setIsLoading(true);
      try {
        if (!userMail) return;

        const res = await axios.get("http://localhost:5000/OrderProducts", {
          params: { email: userMail },
        });

        const transactions = res?.data?.transactions || [];

        const filteredItems = processTransactionData(transactions);
        const payload = formatPayload(filteredItems);
        SetUserFrequent(payload);
        await dispatch(UserRecommendProduct(payload)).unwrap();

        setError(null);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
        setError("Failed to load transactions. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    getTransactionData();
  }, [dispatch, userMail]);

  const processTransactionData = (
    transactions: { cartItems: CartItem[] }[]
  ): ProcessedCartItem[] => {
    const itemCountMap = new Map<string, ProcessedCartItem>();

    transactions.forEach((transaction) => {
      transaction.cartItems.forEach((item) => {
        if (itemCountMap.has(item.id)) {
          itemCountMap.get(item.id)!.totalQuantity += item.quantity;
        } else {
          itemCountMap.set(item.id, { ...item, totalQuantity: item.quantity });
        }
      });
    });

    return Array.from(itemCountMap.values())
      .filter((item) => item.totalQuantity >= 1)
      .sort((a, b) => b.totalQuantity - a.totalQuantity);
  };

  const formatPayload = (filteredItems: ProcessedCartItem[]) => ({
    Carts: filteredItems.map(
      ({ id, mealName, quantity, price, mealThumb }) => ({
        id,
        mealName,
        quantity,
        price,
        mealThumb,
      })
    ),
  });

  const CartEvent = async (product: ProductsCart) => {
    try {
      console.log(product, "Added product");

      await dispatch(
        AddtoCart({
          id: product.idMeal,
          mealName: product.strMeal,
          mealThumb: product.strMealThumb,
          quantity: 1,
          price: product.price,
        })
      );
      toast.success("Added to Cart", {
        icon: "🛒",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    } catch (error) {
      console.error("Add to cart failed:", error);
    }
  };
  const FavEvent = async (product: ProductsCart) => {
    try {
      await dispatch(
        AddtoCart({
          id: product.id,
          mealName: product.mealName,
          mealThumb: product.mealThumb,
          quantity: 1,
          price: product.price,
        })
      );
      toast.success("Added to Cart", {
        icon: "🛒",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    } catch (error) {
      console.error("Add to cart failed:", error);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-t-4 border-orange-500 border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-white text-lg">
            Loading your culinary preferences...
          </p>
        </div>
      </div>
    );
  }

  // Render error state
  // if (error) {
  //   return (
  //     <div className="min-h-[400px] flex items-center justify-center">
  //       <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md">
  //         <h3 className="text-red-400 text-xl font-bold mb-2">
  //           Oops! Something went wrong
  //         </h3>
  //         <p className="text-slate-300">{error}</p>
  //         <button
  //           onClick={() => window.location.reload()}
  //           className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
  //         >
  //           Try Again
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="pt-8 pb-16">
      {Array.isArray(mostPurchased) && mostPurchased.length > 0 && (
        <section className="mb-16 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Enhanced Header with Animation */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-r from-amber-400 to-yellow-600 p-2 rounded-lg">
                  <IoFlame className="text-white text-xl" />
                </div>
                <h2 className="text-amber-400 font-medium text-lg">
                  Personalized For You
                </h2>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold">
                <span className="text-white">Curated Delights </span>
                <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
                  For Your Palate
                </span>
              </h1>
              <p className="text-slate-400 mt-3 max-w-2xl">
                Based on your previous orders, we've crafted a collection of
                meals that match your taste preferences and culinary journey.
              </p>
            </div>

            {/* Product Carousel */}
            <motion.div
              className="overflow-hidden"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <div className="flex overflow-x-auto py-4 px-1 gap-6 no-scrollbar">
                {mostPurchased.map((item, index) => (
                  <motion.div
                    key={item.idMeal}
                    className="flex-shrink-0"
                    variants={itemVariants}
                  >
                    <div className="w-72 bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl overflow-hidden shadow-lg shadow-black/30 border border-slate-700/30 group hover:shadow-amber-700/10 transition-all">
                      {/* Image Container */}
                      <div className="relative h-48 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10 opacity-60"></div>
                        <img
                          src={item.strMealThumb}
                          alt={item.strMeal}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute top-3 right-3 bg-amber-500 text-xs text-white font-bold rounded-full px-2 py-1 z-10">
                          Recommended
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <div className="flex items-center mb-2">
                          <div className="flex items-center text-amber-400">
                            <FaStar />
                            <span className="ml-1 text-xs text-white">
                              4.{8 - (index % 4)}
                            </span>
                          </div>
                          <div className="flex items-center text-slate-400 text-xs ml-3">
                            <FaRegClock className="mr-1" />
                            <span>{20 + (index % 15)} min</span>
                          </div>
                        </div>

                        <h3 className="text-xl font-semibold text-white mb-2 line-clamp-1">
                          {item.strMeal}
                        </h3>

                        <div className="flex items-center justify-between mt-4">
                          <div>
                            <p className="text-slate-400 text-xs">Price</p>
                            <p className="text-white font-bold">
                              ₹{item.price}
                            </p>
                          </div>

                          <button
                            onClick={() => CartEvent(item)}
                            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-400 hover:from-amber-600 hover:to-orange-500 text-white px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-[1.03] active:scale-95"
                          >
                            <FaCartShopping size={16} />
                            <span>Add</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {Array.isArray(userFrequent.Carts) && userFrequent.Carts.length > 0 && (
        <section className="px-4">
          <div className="max-w-7xl mx-auto">
            {/* Enhanced Header with Animation */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-r from-green-400 to-emerald-600 p-2 rounded-lg">
                  <FaRegClock className="text-white text-xl" />
                </div>
                <h2 className="text-green-400 font-medium text-lg">
                  Frequent Choices
                </h2>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold">
                <span className="text-white">Your Favorite </span>
                <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                  Go-To Meals
                </span>
              </h1>
              <p className="text-slate-400 mt-3 max-w-2xl">
                The dishes you love the most, always one click away. Your
                frequent orders showcase your culinary preferences.
              </p>
            </div>

            {/* Product Carousel */}
            <motion.div
              className="overflow-hidden"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <div className="flex overflow-x-auto py-4 px-1 gap-6 no-scrollbar">
                {userFrequent.Carts?.map((item, index) => (
                  <motion.div
                    key={item.id}
                    className="flex-shrink-0"
                    variants={itemVariants}
                  >
                    <div className="w-72 bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl overflow-hidden shadow-lg shadow-black/30 border border-slate-700/30 group hover:shadow-emerald-700/10 transition-all">
                      {/* Image Container */}
                      <div className="relative h-48 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10 opacity-60"></div>
                        <img
                          src={item.mealThumb}
                          alt={item.mealName}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute top-3 right-3 bg-emerald-500 text-xs text-white font-bold rounded-full px-2 py-1 z-10">
                          Frequent
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <div className="flex items-center mb-2">
                          <div className="flex items-center text-green-400">
                            <FaStar />
                            <span className="ml-1 text-xs text-white">
                              4.{9 - (index % 5)}
                            </span>
                          </div>
                          <div className="flex items-center text-slate-400 text-xs ml-3">
                            <FaRegClock className="mr-1" />
                            <span>{15 + (index % 20)} min</span>
                          </div>
                        </div>

                        <h3 className="text-xl font-semibold text-white mb-2 line-clamp-1">
                          {item.mealName}
                        </h3>

                        <div className="flex items-center justify-between mt-4">
                          <div>
                            <p className="text-slate-400 text-xs">Price</p>
                            <p className="text-white font-bold">
                              ₹{item.price}
                            </p>
                          </div>

                          <button
                            onClick={() => FavEvent(item)}
                            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 text-white px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-[1.03] active:scale-95"
                          >
                            <FaCartShopping size={16} />
                            <span>Add</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* {(!Array.isArray(mostPurchased) || mostPurchased.length === 0) &&
        (!Array.isArray(userFrequent.Carts) ||
          userFrequent.Carts.length === 0) && (
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 max-w-md text-center">
              <div className="bg-slate-700/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FaCartShopping size={24} className="text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                No Order History Found
              </h3>
              <p className="text-slate-400 mb-4">
                Explore our delicious menu and place your first order to get
                personalized recommendations.
              </p>
              <Link
                to="/"
                className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all"
              >
                Browse Menu
              </Link>
            </div>
          </div>
        )} */}
    </div>
  );
}

export default FrequentProducts;
