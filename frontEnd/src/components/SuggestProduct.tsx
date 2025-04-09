import React, { useEffect, useState } from "react";
import { FaCartShopping, FaStar, FaRegStar, FaHeart } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { AddtoCart } from "../Redux/CartSlice";
import toast from "react-hot-toast";

function SuggestProduct({ products }: { products: string[] }) {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const dispatch = useDispatch();

  useEffect(() => {
    const cached = localStorage.getItem("suggestions");
    const savedFavorites = localStorage.getItem("favorites");

    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    if (cached) {
      setSuggestions(JSON.parse(cached));
      setLoading(false);
    } else if (Array.isArray(products) && products.length > 0) {
      FetchUserPicks();
    }
  }, [products]);

  async function FetchUserPicks() {
    setLoading(true);
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
            rating: (Math.random() * 2 + 3).toFixed(1),
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
              rating: (Math.random() * 2 + 3).toFixed(1),
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
      toast.error("Failed to load recommendations");
    } finally {
      setLoading(false);
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

      // Animate the toast with a custom icon
      toast.success("Added to cart successfully", {
        icon: "🛒",
        duration: 2000,
      });
    } catch (error) {
      console.error("Add to cart failed:", error);
      toast.error("Failed to add to cart");
    }
  };

  const toggleFavorite = (id: string) => {
    const newFavorites = { ...favorites, [id]: !favorites[id] };
    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));

    if (!favorites[id]) {
      toast.success("Added to favorites", { icon: "❤️" });
    } else {
      toast("Removed from favorites", { icon: "🗑️" });
    }
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(Number(rating));
    const stars = [];

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }

    return stars;
  };

  return (
    <div className="w-full">
      {suggestions.length > 0 && (
        <div className="w-full bg-gradient-to-b from-slate-900 to-slate-800 mt-10 px-4 py-10 rounded-xl shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl sm:text-5xl text-white font-bold select-none relative">
              Your Favorite <span className="text-yellow-500">Products</span>
              {/* <span className="absolute bottom-0 mt-3 left-0 w-24 h-1 bg-yellow-500 rounded-full"></span> */}
            </h1>
            {/* <button
              onClick={() => FetchUserPicks()}
              className="bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-600 transition-all duration-300 shadow-lg flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button> */}
          </div>

          <div className="mt-8 overflow-x-auto no-scrollbar pb-4">
            <div className="flex gap-6 w-max">
              {suggestions.map((item: any) => (
                <div
                  key={item.idMeal}
                  className="flex-shrink-0 bg-gradient-to-br from-slate-800 to-slate-900 h-[380px] w-[300px] rounded-2xl shadow-xl overflow-hidden relative group transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/20 transform hover:-translate-y-1"
                >
                  <div className="absolute bg-gradient-to-br from-pink-50 to-pink-100 h-[200px] w-[370px] rounded-bl-full -left-14">
                    <div className="relative flex items-center justify-center mt-2">
                      <img
                        src={item.strMealThumb}
                        alt={item.strMeal}
                        className="ml-5 rounded-full h-44 w-52 object-cover hover:scale-110 transition-transform duration-300 select-none shadow-lg group-hover:shadow-xl"
                      />
                      <div
                        className="absolute top-0 right-0 mr-16 mt-2 bg-white rounded-full p-2 cursor-pointer transform transition-transform duration-200 hover:scale-110"
                        onClick={() => toggleFavorite(item.idMeal)}
                      >
                        <FaHeart
                          size={20}
                          className={
                            favorites[item.idMeal]
                              ? "text-red-500"
                              : "text-gray-300"
                          }
                        />
                      </div>
                      {/* <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {Math.floor(Math.random() * 30 + 10)}% OFF
                      </div> */}
                    </div>
                  </div>

                  <div className="flex flex-col z-20 mt-56 mx-4 gap-3">
                    <h2
                      className="text-2xl text-green-300 font-semibold truncate"
                      title={item.strMeal}
                    >
                      {item.strMeal.length > 20
                        ? `${item.strMeal.slice(0, 20)}...`
                        : item.strMeal}
                    </h2>

                    <div className="flex items-center">
                      {renderStars(item.rating)}
                      <span className="ml-2 text-white text-sm">
                        {item.rating}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <p className="text-gray-400 text-sm line-through">
                          Rs. {Math.floor(item.price * 1.2)}
                        </p>
                        <p className="text-xl font-bold text-white">
                          Rs. {item.price}
                        </p>
                      </div>
                      <button
                        onClick={() => CartEvent(item)}
                        className="select-none flex items-center gap-2 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full px-4 py-2 hover:from-orange-500 hover:to-yellow-600 transform hover:scale-105 transition-all duration-300 shadow-md"
                      >
                        <span className="font-medium text-white">Add</span>
                        <FaCartShopping size={18} className="text-white" />
                      </button>
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
