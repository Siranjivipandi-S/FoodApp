import { useState } from "react";
import { Link, Outlet } from "react-router-dom";

function Menu() {
  const [isactive, setIsActive] = useState<string | null>("All");

  const categories: any[] = [
    {
      name: "All",
      path: "/",
    },
    {
      name: "Break Fast",
      path: "/breakfast",
    },
    {
      name: "Sea Foods",
      path: "/seefood",
    },
  ];

  return (
    <div className="relative w-full z-10 transition-transform bg-yellow-100">
      <div className="flex flex-col mt-8 items-center justify-center">
        <h1 className="text-5xl text-orange-500 font-mono select-none">
          MENU SECTION
        </h1>
        <ul className="flex gap-20 mt-10">
          {categories.map((category, index) => (
            <li key={index}>
              <Link
                to={category.path}
                onClick={() => setIsActive(category.name)}
                className={`select-none px-5 py-2 text-2xl ${
                  isactive === category.name
                    ? "bg-slate-800 text-white rounded-full"
                    : ""
                } cursor-pointer transition-colors focus:bg-slate-800 focus:rounded-full focus:text-white`}
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
        <div className="container mt-10 mb-10">
          <div className="grid grid-cols-4 gap-5 place-content-center w-fit">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Menu;
