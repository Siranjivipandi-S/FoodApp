import { useDispatch, useSelector } from "react-redux";
import { selectAllProducts } from "../../Redux/Productslice";
import { Product } from "../../Redux/Productslice";
import { Link, useNavigate } from "react-router-dom";
import { FaCartShopping } from "react-icons/fa6";
import { RootState } from "@reduxjs/toolkit/query";
import { ProductsCart } from "./BreakFast";
import { AddtoCart } from "../../Redux/CartSlice";
import toast from "react-hot-toast";

function AllCategory() {
  const Getproducts = useSelector((state: RootState) =>
    selectAllProducts(state)
  ) as Product[];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const CartEvent = async (product: ProductsCart) => {
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

      toast.success("Add to Cart");
    } catch (error) {
      toast.error("Login to Continue");
      navigate("/Landing/Login");
      console.log(error);
    }
  };
  return (
    <>
      {Getproducts && Getproducts.length > 0
        ? Getproducts.map((product) => (
            <div
              className="bg-slate-800 h-full w-[300px] mb-3 rounded-xl relative shadow-lg overflow-hidden"
              key={product.idCategory}
            >
              <div className="absolute bg-pink-50 h-[200px] w-[370px] rounded-bl-full -left-14">
                <div className="flex items-center justify-center mt-2 ml-5">
                  <img
                    src={product.strCategoryThumb}
                    alt={product.strCategory}
                    className="ml-5 rounded-full h-44 w-52 hover:scale-110 transition-transform select-none"
                  />
                </div>
              </div>
              <div className="flex flex-col z-20 mt-56 ml-4 gap-4">
                <h2 className="text-2xl text-green-300 select-none">
                  {product.strCategory}
                </h2>
                <p className="text-white select-none mr-2">
                  {`${product.strCategoryDescription.slice(0, 120)}..`}
                </p>

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

export default AllCategory;
