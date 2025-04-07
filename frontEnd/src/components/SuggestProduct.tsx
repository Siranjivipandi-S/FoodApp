import React, { useEffect, useState } from "react";
import { FaCartShopping } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { AddtoCart } from "../Redux/CartSlice";
import toast from "react-hot-toast";

function SuggestProduct({ products }: { products: string[] }) {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const cached = localStorage.getItem("suggestions");

    if (cached) {
      setSuggestions(JSON.parse(cached));
    } else if (Array.isArray(products) && products.length > 0) {
      FetchUserPicks();
    }
  }, [products]);

  async function FetchUserPicks() {
    try {
      const allMeals: any[] = [];

      if (products.length === 1) {
        const res = await fetch(
          `https://www.themealdb.com/api/json/v1/1/filter.php?c=${products[0]}`
        );
        const data = await res.json();
        if (data.meals) {
          const mealsWithPrice = data.meals.slice(0, 10).map((meal: any) => ({
            ...meal,
            price: Math.floor(Math.random() * (400 - 200 + 1)) + 200,
          }));
          allMeals.push(...mealsWithPrice);
        }
      } else {
        const tempMeals: any[] = [];
        for (const category of products) {
          const res = await fetch(
            `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
          );
          const data = await res.json();
          if (data.meals) {
            const mealsWithPrice = data.meals.slice(0, 4).map((meal: any) => ({
              ...meal,
              price: Math.floor(Math.random() * (400 - 200 + 1)) + 200,
            }));
            tempMeals.push(...mealsWithPrice);
          }
        }
        allMeals.push(...tempMeals.slice(0, 15));
      }

      setSuggestions(allMeals);
      localStorage.setItem("suggestions", JSON.stringify(allMeals));
    } catch (error) {
      console.error("Error fetching meals:", error);
    }
  }

  const CartEvent = async (product: any) => {
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
    <div className="w-full">
      {suggestions.length > 0 && (
        <div className="w-full bg-slate-900 mt-10 px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl sm:text-5xl text-white font-bold select-none">
              Your Favorite <span className="text-yellow-500">Products</span>
            </h1>
          </div>

          <div className="mt-8 overflow-x-auto no-scrollbar">
            <div className="flex gap-5 w-max">
              {suggestions.map((item: any) => (
                <div
                  key={item.idMeal}
                  className="flex-shrink-0 bg-slate-800 h-[360px] w-[300px] rounded-xl shadow-lg overflow-hidden relative"
                >
                  <div className="absolute bg-pink-50 h-[200px] w-[370px] rounded-bl-full -left-14">
                    <div className="flex items-center justify-center mt-2">
                      <img
                        src={item.strMealThumb}
                        alt={item.strMeal}
                        className="ml-5 rounded-full h-44 w-52 hover:scale-110 transition-transform duration-200 select-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col z-20 mt-56 ml-4 gap-4">
                    <h2 className="text-2xl text-green-300 select-none">
                      {item.strMeal.slice(0, 20)}..
                    </h2>
                    <div className="flex items-center justify-between pr-5">
                      <p className="text-lg text-white select-none">
                        Rs. {item.price}
                      </p>
                      <Link
                        onClick={() => CartEvent(item)}
                        className="select-none flex items-center gap-2 bg-orange-400 rounded-full px-3 py-1.5 hover:bg-orange-300 hover:scale-105 transition-transform duration-200"
                      >
                        Add Cart
                        <FaCartShopping size={20} color="white" />
                      </Link>
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

export default SuggestProduct;
