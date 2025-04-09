import { useDispatch, useSelector } from "react-redux";

import { AddtoCart } from "../../Redux/CartSlice";
import toast from "react-hot-toast";
import FoodCard from "../FoodCard";
import { selectAllSeeFoods } from "../../Redux/Productslice";

// Seafood Component
export default function MeatCategory() {
  const dispatch = useDispatch();
  const seefood = useSelector((state: RootState) => selectAllSeeFoods(state));

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

      toast.success("Seafood added to cart!", {
        icon: "🦞",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-slate-300 border-b pb-2">
        Fresh Seafood Selection
      </h2>

      {seefood && seefood.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {seefood.map((item) => (
            <FoodCard
              key={item.idMeal}
              product={{ ...item, rating: (Math.random() * 2 + 3).toFixed(1) }}
              onAddToCart={CartEvent}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 mb-4"></div>
          <p className="text-gray-500">Fishing for seafood options...</p>
        </div>
      )}
    </div>
  );
}
