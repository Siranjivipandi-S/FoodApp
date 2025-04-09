import { useDispatch, useSelector } from "react-redux";
import { selectAllProducts } from "../../Redux/Productslice";
import { Product } from "../../Redux/Productslice";
import { useNavigate } from "react-router-dom";
import { RootState } from "@reduxjs/toolkit/query";
import { AddtoCart } from "../../Redux/CartSlice";
import toast from "react-hot-toast";
import FoodCard from "../FoodCard";

function AllCategory() {
  const Getproducts = useSelector((state: RootState) =>
    selectAllProducts(state)
  ) as Product[];
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const CartEvent = async (product) => {
    try {
      await dispatch(
        AddtoCart({
          id: product.idCategory,
          mealName: product.strCategory,
          mealThumb: product.strCategoryThumb,
          quantity: 1,
          price: product.price,
        })
      );

      toast.success("Added to your cart!", {
        icon: "🛒",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    } catch (error) {
      toast.error("Please login to continue", {
        icon: "🔒",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      navigate("/Landing/Login");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-slate-300">All Categories</h2>
        <div className="flex gap-2">
          {/* <button className="bg-white shadow px-4 py-2 rounded-full text-gray-800 hover:bg-gray-100">
            Filter
          </button>
          <button className="bg-white shadow px-4 py-2 rounded-full text-gray-800 hover:bg-gray-100">
            Sort
          </button> */}
        </div>
      </div>

      {Getproducts && Getproducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Getproducts.map((product) => (
            <FoodCard
              key={product.idCategory}
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
          <p className="text-gray-500">Setting the table...</p>
        </div>
      )}
    </div>
  );
}

export default AllCategory;
