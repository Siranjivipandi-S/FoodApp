import { useState } from "react";
import { FaCartShopping, FaHeart, FaStar } from "react-icons/fa6";

export default function FoodCard({ product, onAddToCart }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      className="bg-slate-200 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="relative">
        <img
          src={product.strMealThumb || product.strCategoryThumb}
          alt={product.strMeal || product.strCategory}
          className={`w-full h-64 object-cover transition-transform duration-700 ${
            hover ? "scale-110" : "scale-100"
          }`}
        />
        {/* <div className="absolute top-3 right-3 bg-white p-1 rounded-full shadow-md">
          <FaHeart className="text-gray-400 hover:text-red-500 cursor-pointer" />
        </div> */}

        {product.rating && (
          <div className="absolute bottom-3 left-3 bg-orange-400 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
            <FaStar /> <span>{product.rating}</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {product.strMeal || product.strCategory}
        </h3>

        {product.strCategoryDescription && (
          <p className="text-gray-600 text-sm mb-3">
            {`${product.strCategoryDescription.slice(0, 90)}...`}
          </p>
        )}

        <div className="flex justify-between items-center mt-4">
          <span className="text-xl font-bold text-orange-600">
            Rs. {product.price}
          </span>

          <button
            onClick={() => onAddToCart(product)}
            className="select-none flex items-center gap-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-full py-2 px-4 hover:from-orange-500 hover:to-orange-600 transition-all duration-300 shadow-sm hover:shadow transform hover:scale-105"
          >
            <FaCartShopping /> Add
          </button>
        </div>
      </div>
    </div>
  );
}
