import { useState, useEffect } from "react";
import scrolldown from "../assets/scrolldown.gif";

function GreetComp() {
  const [currentTime, setCurrentTime] = useState("");
  const [greeting, setGreeting] = useState("");
  const [user, setUser] = useState("");

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(storedUser.slice(0, 1).toUpperCase() + storedUser.slice(1));
    }

    // Set current time and appropriate greeting
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );

      if (hours < 12) setGreeting("Good morning");
      else if (hours < 18) setGreeting("Good afternoon");
      else setGreeting("Good evening");
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  function scrollToDown() {
    window.scrollTo({
      top: window.innerHeight - 100,
      behavior: "smooth",
    });
  }
  function scrollToSpecial() {
    window.scrollTo({
      top: window.innerHeight + 4200,
      behavior: "smooth",
    });
  }

  return (
    <div
      className="relative h-screen flex items-center justify-center bg-gradient-to-br from-orange-400 to-red-500"
      style={{
        backgroundImage: "url('./src/assets/hero-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Colorful blurred circles for glassmorphism effect */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-yellow-300 blur-3xl opacity-30"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-red-400 blur-3xl opacity-20"></div>
        <div className="absolute top-1/2 right-1/3 w-80 h-80 rounded-full bg-orange-400 blur-3xl opacity-25"></div>
      </div>

      {/* Food emoji background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute text-6xl"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
              opacity: 0.1 + Math.random() * 0.2,
            }}
          >
            {
              ["🍕", "🍔", "🍜", "🍣", "🥗", "🌮", "🍦"][
                Math.floor(Math.random() * 7)
              ]
            }
          </div>
        ))}
      </div>

      {/* Main content card with glassmorphism effect */}
      <div className="max-w-4xl w-full p-8 rounded-2xl bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg shadow-xl border border-white border-opacity-30 z-10 mt-10">
        <div className="flex justify-between items-start mb-6">
          <div className="text-sm font-medium text-white">{currentTime}</div>
          {user && (
            <div className="px-4 py-1 bg-orange-500 bg-opacity-30 backdrop-blur-sm rounded-full text-white font-medium border border-white border-opacity-30">
              Welcome back!
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-md">
            Food Ordering Application
          </h1>

          <div className="flex flex-col gap-3">
            <p className="text-xl text-white text-opacity-90">
              AI-Powered Food Recommendations
            </p>
            {user && (
              <h2 className="text-3xl md:text-4xl font-semibold text-white">
                {greeting},{" "}
                <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
                  {user}
                </span>
                !
              </h2>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-8">
            <button
              onClick={scrollToDown}
              className="px-6 py-3 bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-40 rounded-xl text-white font-medium flex items-center gap-2 hover:bg-opacity-30 hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Explore Menu
              <img
                src={scrolldown}
                className="h-6 w-6 animate-bounce "
                alt="Scroll down"
              />
            </button>

            <button
              onClick={scrollToSpecial}
              className="px-6 py-3 bg-gradient-to-r from-orange-400 to-red-400 bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 rounded-xl text-white font-medium hover:scale-105 hover:shadow-xl hover:ring-2 hover:ring-orange-300 transition-all duration-300"
            >
              Today's Specials
            </button>
          </div>

          <div className="mt-12 py-4 px-6 bg-white bg-opacity-20 backdrop-blur-md rounded-xl border border-white border-opacity-30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white bg-opacity-30 rounded-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  ></path>
                </svg>
              </div>
              <div>
                <p className="font-medium text-white">
                  Our AI recommends dishes based on your preferences and past
                  orders
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GreetComp;
