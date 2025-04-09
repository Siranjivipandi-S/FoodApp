import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import { selectAllMeals } from "../Redux/Productslice";
import { Link } from "react-router-dom";
import { FaCartShopping, FaStar, FaFire, FaHeart } from "react-icons/fa6";
import { motion } from "framer-motion";
import { ProductsCart } from "./Category/BreakFast";
import { AddtoCart } from "../Redux/CartSlice";
import toast from "react-hot-toast";

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
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
    },
  },
};

function MainIngredients() {
  const mainIngredients = useSelector((state: RootState) =>
    selectAllMeals(state)
  );
  const dispatch = useDispatch();
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    // Add some parallax effect on scroll
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));

    toast.success(
      favorites[id] ? "Removed from favorites" : "Added to favorites",
      {
        icon: favorites[id] ? "💔" : "❤️",
        style: {
          borderRadius: "10px",
          background: "#1e293b",
          color: "#fff",
        },
      }
    );
  };

  const CartEvent = async (product: ProductsCart) => {
    try {
      // Check if product has all required fields
      if (!product || !product.idMeal || !product.strMeal) {
        throw new Error("Invalid product data");
      }

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
          background: "#1e293b",
          color: "#fff",
        },
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to add to cart");
    }
  };

  return (
    <div className="relative w-full bg-gradient-to-b from-slate-900 to-slate-800 py-24 overflow-hidden">
      {/* Background gradient orbs */}
      <div
        className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        style={{ transform: `translateY(${scrollPosition * 0.1}px)` }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"
        style={{ transform: `translateY(${-scrollPosition * 0.05}px)` }}
      />

      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-green-400 font-medium text-lg mb-3 bg-green-400/10 px-4 py-1 rounded-full">
            Our Specialty
          </span>
          <h1 className="text-5xl lg:text-6xl font-bold text-white text-center select-none mb-4">
            Signature{" "}
            <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Ingredients
            </span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-emerald-500 mx-auto mb-4"></div>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Experience the finest quality ingredients that make our dishes
            unique and flavorful. Each component is carefully selected for its
            exceptional taste.
          </p>
        </motion.div>

        {/* Ingredients Carousel */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative"
        >
          <div className="relative overflow-hidden py-4">
            {/* Left fade gradient */}
            <div className="absolute left-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-r from-slate-900 to-transparent z-10"></div>

            {/* Right fade gradient */}
            <div className="absolute right-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-l from-slate-900 to-transparent z-10"></div>

            <div className="flex overflow-x-auto pl-5 px-2 gap-6 no-scrollbar py-4">
              <div className="flex flex-nowrap space-x-6">
                {mainIngredients &&
                  mainIngredients.map((item, index) => (
                    <motion.div
                      className="flex-shrink-0"
                      key={item.idMeal}
                      variants={itemVariants}
                    >
                      <div className="w-[300px] h-[380px] bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl relative overflow-hidden group shadow-lg shadow-black/40 border border-slate-700/30 hover:shadow-yellow-600/10 transition-all duration-300">
                        {/* Top semicircle background with gradient */}
                        <div className="absolute top-0 w-full h-[220px] bg-gradient-to-r from-yellow-400/90 to-amber-500/90 rounded-b-[140px] overflow-hidden">
                          <div className="absolute inset-0 opacity-20">
                            <div className="absolute -inset-[100%] bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
                          </div>
                        </div>

                        {/* Image with floating animation */}
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
                          <div className="relative">
                            {/* Halo effect behind image */}
                            <div className="absolute inset-0 bg-white/20 blur-xl rounded-full scale-90"></div>

                            <motion.div
                              animate={{
                                y: [0, -8, 0],
                              }}
                              transition={{
                                repeat: Infinity,
                                duration: 3,
                                ease: "easeInOut",
                              }}
                            >
                              <img
                                src={item.strMealThumb}
                                alt={item.strMeal}
                                className="rounded-full h-44 w-44 object-cover shadow-lg border-4 border-white/20 group-hover:scale-110 transition-transform duration-500 select-none"
                              />
                            </motion.div>

                            {/* Special tag */}
                            {index % 3 === 0 && (
                              <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg shadow-green-500/30 flex items-center gap-1">
                                <FaFire className="text-yellow-200" size={10} />
                                POPULAR
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-1">
                              <FaStar className="text-yellow-400" size={16} />
                              <span className="text-white font-medium text-sm">
                                {(4 + Math.random()).toFixed(1)}
                              </span>
                            </div>

                            <button
                              onClick={() => toggleFavorite(item.idMeal)}
                              className="p-2 rounded-full bg-slate-700/50 hover:bg-slate-700 transition-colors"
                            >
                              <FaHeart
                                size={16}
                                className={
                                  favorites[item.idMeal]
                                    ? "text-red-500"
                                    : "text-slate-400"
                                }
                              />
                            </button>
                          </div>

                          <h2 className="text-2xl font-bold text-white select-none mb-2 line-clamp-1">
                            {item.strMeal}
                          </h2>

                          <div className="mt-4 flex items-center justify-between">
                            <div>
                              <p className="text-slate-400 text-xs mb-1">
                                Price
                              </p>
                              <p className="text-2xl font-bold text-white select-none">
                                ₹{item.price}
                              </p>
                            </div>

                            <button
                              onClick={() => CartEvent(item)}
                              className="select-none flex font-medium items-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-slate-900 px-4 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
                            >
                              Add
                              <FaCartShopping size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          </div>

          {/* Navigation hint */}
          <div className="flex justify-center mt-6">
            <div className="flex items-center gap-2 text-slate-500 bg-slate-800/50 px-4 py-2 rounded-full">
              <span className="animate-pulse">←</span>
              <span className="text-sm">Swipe to explore more</span>
              <span className="animate-pulse">→</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default MainIngredients;
