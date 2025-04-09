import { useState } from "react";
import { Link, Outlet } from "react-router-dom";

// Menu Component with enhanced UI
export default function Menu() {
  const [isactive, setIsActive] = useState("Break Fast");

  const categories = [
    {
      name: "All",
      path: "/",
      icon: "🍽️",
    },
    {
      name: "Break Fast",
      path: "/breakfast",
      icon: "🍳",
    },
    {
      name: "Sea Foods",
      path: "/seefood",
      icon: "🦞",
    },
  ];

  return (
    <div className="bg-slate-800 shadow-lg max-w-7xl rounded-xl mx-auto  my-8 overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-orange-400 to-orange-600">
        <h1 className="text-4xl font-bold text-white text-center mb-2">
          Delicious Delights
        </h1>
        <p className="text-white text-center opacity-90">
          Discover our amazing menu selections
        </p>
      </div>

      <div className="flex items-center justify-center flex-wrap gap-3 p-6 bg-slate-800">
        {categories.map((category, index) => (
          <Link
            key={index}
            to={category.path}
            onClick={() => setIsActive(category.name)}
            className={`select-none px-6 py-3 text-xl flex items-center gap-2 ${
              isactive === category.name
                ? "bg-slate-800 text-white rounded-full shadow-md"
                : "bg-white shadow-sm hover:shadow text-gray-700 rounded-full"
            } cursor-pointer transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400`}
          >
            <span>{category.icon}</span>
            {category.name}
          </Link>
        ))}
      </div>

      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
}
