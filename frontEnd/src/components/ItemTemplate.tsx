import { FaCartShopping } from "react-icons/fa6";
import { Link } from "react-router-dom";

function ItemTemplate() {
  return (
    <div className="bg-slate-800 h-[340px] w-[300px] mb-3 rounded-xl relative shadow-lg overflow-hidden">
      <div className="absolute bg-orange-100 h-[200px] w-[370px] rounded-bl-full -left-14">
        <div className="flex items-center justify-center mt-2">
          <img
            src="./src\assets\Burger.jpg"
            alt=""
            className="ml-5 rounded-full h-44 w-52 hover:scale-110 transition-transform select-none"
          />
        </div>
      </div>
      <div className="flex flex-col z-20 mt-56 ml-4  gap-4">
        <h2 className="text-2xl text-green-300 select-none">Food Name</h2>

        <div className="flex items-center justify-between">
          <p className="text-lg text-white select-none">price</p>
          <Link
            to={"/"}
            className="select-none flex font-medium items-center gap-2 mr-5 bg-red-500 text-white rounded-full p-2 hover:bg-orange-300 hover:scale-105 transition-transform"
          >
            Remove
            <FaCartShopping size={20} color="white" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ItemTemplate;
