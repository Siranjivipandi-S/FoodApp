import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { selectAllBreakfasts } from "../../Redux/Productslice";
import { Link } from "react-router-dom";
import { FaCartShopping } from "react-icons/fa6";
import { AddtoCart } from "../../Redux/CartSlice";
import toast from "react-hot-toast";
export interface ProductsCart {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  price: number;
  quanity?: number;
}
function BreakFast() {
  const breakfast = useSelector((state: RootState) =>
    selectAllBreakfasts(state)
  );
  const dispatch = useDispatch();
  const CartEvent = async (product: ProductsCart) => {
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
  };
  return (
    <>
      {breakfast && breakfast.length > 0
        ? breakfast.map((product) => (
            <div
              className="bg-slate-800 h-full w-[300px] mb-3 rounded-xl relative shadow-lg overflow-hidden"
              key={product.idMeal}
            >
              <div className="absolute bg-pink-50 h-[200px] w-[370px] rounded-bl-full -left-14">
                <div className="flex items-center justify-center mt-2 ml-5">
                  <img
                    src={product.strMealThumb}
                    alt={product.strMealThumb}
                    className="ml-5 rounded-full h-44 w-52 hover:scale-110 transition-transform select-none"
                  />
                </div>
              </div>
              <div className="flex flex-col z-20 mt-56 ml-4 gap-4">
                <h2 className="text-2xl text-green-300 select-none">
                  {product.strMeal}
                </h2>

                <div className="flex items-center justify-between">
                  <p className="text-lg text-white select-none">
                    Rs. {product.price}
                  </p>
                  <Link
                    onClick={() => CartEvent(product)}
                    className="select-none flex font-medium items-center gap-2 mr-5 bg-orange-400 rounded-full p-2 hover:bg-orange-300 hover:scale-105 transition-transform"
                  >
                    Add Cart
                    <FaCartShopping size={20} color="white" />
                  </Link>
                </div>
              </div>
            </div>
          ))
        : null}
    </>
  );
}

export default BreakFast;
