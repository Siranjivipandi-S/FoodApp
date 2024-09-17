import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../Redux/store";
import { selectAllUsers } from "../Redux/loginslice";
import scrolldown from "../assets/scrolldown.gif";
import { setToken } from "../Redux/TokenSlice";
function GreetComp() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => selectAllUsers(state));

  return (
    <div className="absolute top-72 mt-10 h-[410px] w-[550px]">
      <div className="flex flex-col gap-5 ml-6">
        <h1 className="text-7xl title-gradient ml-3 select-none">
          Foodify App
        </h1>
        <h1 className="text-6xl greet-gradient ml-3 select-none">
          Welcome's You
        </h1>
        {user && (
          <h1 className="text-6xl ml-3 p-2 text-gradient selection:bg-orange-300 selection:text-white">
            {user[0]?.username}!
          </h1>
        )}

        <div className="relative left-72">
          <Link
            to={"/menu"}
            className="p-2 bg-gradient-to-r from-slate-200 via-orange-400 to-orange-300 rounded-xl w-40 h-fit flex flex-row items-center justify-center gap-5 font-medium hover:scale-105 transition-transform hover:bg-yellow-500"
          >
            Scroll Down
            <img src={scrolldown} className="h-9 w-9"></img>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default GreetComp;
