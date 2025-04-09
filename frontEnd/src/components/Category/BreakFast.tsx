import { useDispatch, useSelector } from "react-redux";
import { AddtoCart } from "../../Redux/CartSlice";
import toast from "react-hot-toast";
import FoodCard from "../FoodCard";
import { selectAllBreakfasts } from "../../Redux/Productslice";

// Breakfast Component
export default function BreakFast() {
  const breakfast = useSelector((state: RootState) =>
    selectAllBreakfasts(state)
  );
  const dispatch = useDispatch();

  const CartEvent = async (product) => {
    await dispatch(
      AddtoCart({
        id: product.idMeal,
        mealName: product.strMeal,
        mealThumb: product.strMealThumb,
        quantity: 1,
        price: product.price,
      })
    );

    toast.success("Added to your cart!", {
      icon: "🍳",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 border-b pb-2 text-slate-300">
        Breakfast Delights
      </h2>

      {breakfast && breakfast.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {breakfast.map((product) => (
            <FoodCard
              key={product.idMeal}
              product={{
                ...product,
                rating: (Math.random() * 2 + 3).toFixed(1),
              }}
              onAddToCart={CartEvent}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 mb-4"></div>
          <p className="text-gray-500">
            Loading delicious breakfast options...
          </p>
        </div>
      )}
    </div>
  );
}
