import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../Redux/store";
import { selectAllRandomMeals, fetchRandomMeal } from "../Redux/Productslice";
import { FaCartShopping } from "react-icons/fa6";
import { IoFastFood } from "react-icons/io5";
import { AddtoCart } from "../Redux/CartSlice";
import toast from "react-hot-toast";
import { FaFireAlt } from "react-icons/fa";

function RandomMeal() {
  const dispatch = useDispatch();
  const randomMeal = useSelector((state: RootState) =>
    selectAllRandomMeals(state)
  );

  useEffect(() => {
    dispatch(fetchRandomMeal());
  }, [dispatch]);

  const CartEvent = async (product) => {
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

      toast.success("Added to cart successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to add to cart");
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center p-4 bg-slate-900">
      <div className="w-full max-w-4xl bg-slate-900 rounded-2xl shadow-lg overflow-hidden border border-orange-100">
        <div className="flex items-center justify-between p-5 bg-gradient-to-r from-orange-500 to-amber-500">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <IoFastFood className="mr-2" size={28} />
            Daily Special
          </h2>
          <span className="bg-red-500 text-white text-sm font-semibold px-3 py-1 rounded-full animate-pulse flex items-center">
            <FaFireAlt className="mr-1" /> Today Only
          </span>
        </div>

        {randomMeal && randomMeal.length > 0 ? (
          <div className="flex flex-col md:flex-row">
            {/* Left Side - Content */}
            <div className="md:w-1/2 p-6 flex flex-col justify-between bg-slate-800 text-white">
              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-2">
                  {randomMeal[0].strMeal}
                </h3>
                <p className="mb-6 text-gray-300">
                  Our chef's special recommendation for today. A delightful meal
                  prepared with premium ingredients and authentic flavors.
                </p>
              </div>

              <div className="mt-auto">
                <div className="flex items-baseline mb-4">
                  <span className="text-gray-400 line-through text-lg mr-2">
                    Rs. {randomMeal[0].price}
                  </span>
                  <span className="text-2xl font-bold text-orange-400">
                    Rs. {randomMeal[0].price - 50}
                  </span>
                  <span className="ml-2 bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-md">
                    Save Rs. 50
                  </span>
                </div>

                <button
                  onClick={() => CartEvent(randomMeal[0])}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  <FaCartShopping size={18} />
                  Add to Cart
                </button>
              </div>
            </div>

            {/* Right Side - Image */}
            <div className="md:w-1/2 relative overflow-hidden">
              <div className="absolute top-3 left-3 bg-orange-500 text-white px-4 py-1 rounded-full font-semibold text-sm shadow-md z-10">
                Featured
              </div>
              <img
                src={randomMeal[0].strMealThumb}
                alt={randomMeal[0].strMeal}
                className="w-full h-72 md:h-full object-cover transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="rounded-full bg-slate-200 h-16 w-16 mb-4"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RandomMeal;
