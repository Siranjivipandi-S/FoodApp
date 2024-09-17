import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../Redux/store";
import { selectAllRandomMeals, fetchRandomMeal } from "../Redux/Productslice";
import { FaCartShopping } from "react-icons/fa6";
import { ProductsCart } from "./Category/BreakFast";
import { AddtoCart } from "../Redux/CartSlice";
import toast from "react-hot-toast";

function RandomMeal() {
  const dispatch = useDispatch();
  const randomMeal = useSelector((state: RootState) =>
    selectAllRandomMeals(state)
  );

  useEffect(() => {
    dispatch(fetchRandomMeal());
  }, [dispatch]);
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

      toast.success("Add to Cart");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="relative w-full h-full py-5 bg-orange-300">
      <h1 className="text-5xl text-center">
        Random Meal of <span className="text-red-600">The Day</span>
      </h1>
      <div className="flex items-center justify-around mt-5">
        <div className="flex-col mr-5">
          <h1 className="text-4xl font-thin">
            Here the App Suggested Random Meal For You
          </h1>
          <p className="text-2xl mt-4">
            Suggested "Meal Name" Having{" "}
            <span className="bg-red-500 p-1">Offer Today.</span>{" "}
          </p>
        </div>
        {randomMeal && randomMeal.length > 0 && (
          <div className="bg-slate-800 h-[360px] w-[320px] rounded-xl relative shadow-lg overflow-hidden">
            <div className="absolute bg-pink-50 h-[200px] w-[380px] rounded-bl-full -left-14">
              <div className="flex items-center justify-center mt-2">
                <img
                  src={randomMeal[0].strMealThumb}
                  alt={randomMeal[0].strMeal}
                  className="ml-5 rounded-full h-44 w-52 hover:scale-110 transition-transform select-none"
                />
              </div>
            </div>
            <div className="flex flex-col z-20 mt-56 ml-4 gap-4">
              <h2 className="text-2xl text-green-300 select-none">
                {`${randomMeal[0].strMeal.slice(0, 30)}..`}
              </h2>
              <div className="flex items-center justify-between gap-4">
                <p className="text-lg text-white select-none flex gap-1">
                  Rs.{" "}
                  <span className="line-through text-slate-400">
                    {randomMeal[0].price}
                  </span>
                  {`${randomMeal[0]?.price - 50} Only`}
                </p>
                <button
                  onClick={() => CartEvent(randomMeal[0])}
                  className="select-none flex font-medium items-center gap-2 mr-5 bg-orange-400 rounded-full p-2 hover:bg-orange-300 hover:scale-105 transition-transform"
                >
                  Add to Cart
                  <FaCartShopping size={20} color="white" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RandomMeal;
