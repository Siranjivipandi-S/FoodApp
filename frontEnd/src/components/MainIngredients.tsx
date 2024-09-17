import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import { selectAllMeals } from "../Redux/Productslice";
import { Link } from "react-router-dom";
import { FaCartShopping } from "react-icons/fa6";
import { ProductsCart } from "./Category/BreakFast";
import { AddtoCart } from "../Redux/CartSlice";
import toast from "react-hot-toast";

function MainIngredients() {
  const MainIngrediants = useSelector((state: RootState) =>
    selectAllMeals(state)
  );
  const dispatch = useDispatch();
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
    <div className="relative w-full bg-slate-900 py-10">
      <h1 className="text-5xl text-white text-center select-none">
        Signature <span className="text-yellow-500">Ingredients</span>
      </h1>
      <div className="flex overflow-x-auto pl-5 px-2 mt-10 gap-5 no-scrollbar">
        <div className="flex flex-nowrap space-x-5">
          {MainIngrediants &&
            MainIngrediants.map((item) => (
              <div className="flex-shrink-0" key={item.idMeal}>
                <div className="bg-slate-800 h-[360px] w-[300px] mb-3 rounded-xl relative shadow-lg overflow-hidden">
                  <div className="absolute bg-pink-50 h-[200px] w-[370px] rounded-bl-full -left-14">
                    <div className="flex items-center justify-center mt-2">
                      <img
                        src={item.strMealThumb}
                        alt=""
                        className="ml-5 rounded-full h-44 w-52 hover:scale-110 transition-transform select-none"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col z-20 mt-56 ml-4  gap-4">
                    <h2 className="text-2xl text-green-300 select-none">
                      {`${item.strMeal.slice(0, 20)}..`}
                    </h2>
                    <div className="flex items-center justify-between">
                      <p className="text-lg text-white select-none">
                        Rs.{item.price}
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
  );
}

export default MainIngredients;
