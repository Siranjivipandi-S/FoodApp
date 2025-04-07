import { useEffect, useState } from "react";
import { FaCartShopping } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../Redux/store";
import { selectAllCartItems } from "../Redux/CartSlice";
import { removeToken } from "../Redux/TokenSlice";

function Navbar() {
  const cartItem = useSelector((state: RootState) => selectAllCartItems(state));
  const cartLength = cartItem?.length;
  const [animate, setAnimate] = useState(false);
  const userExists = localStorage.getItem("token");
  const userMail = localStorage.getItem("useremail");
  const showDashborad = userMail == "siranjivi@gmail.com";

  useEffect(() => {
    setAnimate(true);
  }, []);
  const dispatch = useDispatch();
  async function signout() {
    try {
      await dispatch(removeToken({}));
    } catch (error) {}
  }
  return (
    <nav className="fixed min-w-full py-5 px-2 gap-96 h-10 z-30">
      <div className="flex items-center justify-between  bg-slate-900 p-5 rounded-xl backdrop-blur-sm backdrop-filter">
        <Link
          to={"/"}
          className="text-2xl text-green-400 flex gap-2 items-center cursor-pointer"
        >
          Food App
          <FaCartShopping
            size={25}
            color="white"
            className={`transform -rotate-6 mt-1 text-green-400  ${
              animate ? "move-animation" : ""
            }`}
          />
        </Link>
        <ul className="flex gap-5 items-center">
          <li>
            <Link
              to={"/"}
              className="font-sans p-2 text-lg text-white hover:text-orange-300 rounded-lg"
            >
              Home
            </Link>
          </li>
          {showDashborad ? (
            <>
              <li>
                <Link
                  to={"/admin"}
                  className="font-sans p-2 text-lg text-white hover:text-orange-300 rounded-lg"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to={"/orderTrack"}
                  className="font-sans p-2 text-lg text-white hover:text-orange-300 rounded-lg"
                >
                  Order Tracking
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to={"/MyOrders"}
                  className="font-sans p-2 text-lg text-white hover:text-orange-300 rounded-lg"
                >
                  My Orders
                </Link>
              </li>
            </>
          )}
          {userExists ? (
            <li>
              <Link
                className="font-sans p-2 text-lg text-white hover:text-orange-300 rounded-lg"
                onClick={signout}
              >
                Sign out
              </Link>
            </li>
          ) : (
            <li>
              <Link
                className="font-sans p-2 text-lg text-white hover:text-orange-300 rounded-lg"
                to={"/Landing/login"}
              >
                Login
              </Link>
            </li>
          )}

          <li>
            <Link
              className="p-2 flex gap-2 text-white hover:text-orange-300 relative"
              to={"/cart"}
            >
              <div className="relative">
                <FaCartShopping size={25} className="move-animation" />
                {cartLength >= 0 ? (
                  <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartLength}
                  </span>
                ) : null}
              </div>
              Cart
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
