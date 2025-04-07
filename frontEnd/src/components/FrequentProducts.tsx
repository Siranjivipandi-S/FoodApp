import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  UserRecommendProduct,
  selectAllUserProducts,
} from "../Redux/Productslice";
import { Link } from "react-router-dom";
import { FaCartShopping } from "react-icons/fa6";
import { AddtoCart } from "../Redux/CartSlice";
import toast from "react-hot-toast";

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
        console.log(transactions);

        const filteredItems = processTransactionData(transactions);

        const payload = formatPayload(filteredItems);
        console.log(payload, "payload");
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

    // Log the itemCountMap to see all items and their quantities
    console.log(Array.from(itemCountMap.values()), "All Items with Quantities");

    return Array.from(itemCountMap.values())
      .filter((item) => item.totalQuantity >= 1) // Adjusted for debugging
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
      await dispatch(
        AddtoCart({
          id: product.idMeal,
          mealName: product.strMeal,
          mealThumb: product.strMealThumb,
          quantity: 1,
          price: product.price,
        })
      );
      toast.success("Added to Cart");
    } catch (error) {
      console.error("Add to cart failed:", error);
    }
  };

  return (
    <div className="h-full">
      {Array.isArray(mostPurchased) && mostPurchased.length > 0 && (
        <div className="relative w-full bg-slate-900 mt-10">
          <h1 className="text-5xl text-white text-start ml-8 select-none">
            Order According to Your{" "}
            <span className="text-yellow-500">Taste</span>
          </h1>
          <div className="flex overflow-x-auto pl-5 px-2 mt-10 gap-5 no-scrollbar">
            <div className="flex flex-nowrap space-x-5">
              {mostPurchased.map((item) => (
                <div className="flex-shrink-0" key={item.idMeal}>
                  <div className="bg-slate-800 h-[360px] w-[300px] mb-3 rounded-xl relative shadow-lg overflow-hidden">
                    <div className="absolute bg-pink-50 h-[200px] w-[370px] rounded-bl-full -left-14">
                      <div className="flex items-center justify-center mt-2">
                        <img
                          src={item.strMealThumb}
                          alt={item.strMeal}
                          className="ml-5 rounded-full h-44 w-52 hover:scale-110 transition-transform select-none"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col z-20 mt-56 ml-4 gap-4">
                      <h2 className="text-2xl text-green-300 select-none">
                        {`${item.strMeal.slice(0, 20)}..`}
                      </h2>
                      <div className="flex items-center justify-between">
                        <p className="text-lg text-white select-none">
                          Rs. {item.price}
                        </p>
                        <Link
                          onClick={() => CartEvent(item)}
                          className="select-none flex font-medium items-center gap-2 mr-5 bg-orange-400 rounded-full p-2 hover:bg-orange-300 hover:scale-105 transition-transform"
                        >
                          Add Cart
                          <FaCartShopping size={20} color="white" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {Array.isArray(userFrequent.Carts) && userFrequent.Carts.length > 0 && (
        <div className="relative w-full bg-slate-900 mt-10">
          <h1 className="text-5xl text-white text-start ml-8 select-none">
            Your Frequent <span className="text-yellow-500">Orders</span>
          </h1>
          <div className="flex overflow-x-auto pl-5 px-2 mt-10 gap-5 no-scrollbar">
            <div className="flex flex-nowrap space-x-5">
              {userFrequent.Carts?.map((item) => (
                <div className="flex-shrink-0" key={item.id}>
                  <div className="bg-slate-800 h-[360px] w-[300px] mb-3 rounded-xl relative shadow-lg overflow-hidden">
                    <div className="absolute bg-pink-50 h-[200px] w-[370px] rounded-bl-full -left-14">
                      <div className="flex items-center justify-center mt-2">
                        <img
                          src={item.mealThumb}
                          alt={item.strMeal}
                          className="ml-5 rounded-full h-44 w-52 hover:scale-110 transition-transform select-none"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col z-20 mt-56 ml-4 gap-4">
                      <h2 className="text-2xl text-green-300 select-none">
                        {`${item.mealName.slice(0, 20)}..`}
                      </h2>
                      <div className="flex items-center justify-between">
                        <p className="text-lg text-white select-none">
                          Rs. {item.price}
                        </p>
                        <Link
                          onClick={() => CartEvent(item)}
                          className="select-none flex font-medium items-center gap-2 mr-5 bg-orange-400 rounded-full p-2 hover:bg-orange-300 hover:scale-105 transition-transform"
                        >
                          Add Cart
                          <FaCartShopping size={20} color="white" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FrequentProducts;
