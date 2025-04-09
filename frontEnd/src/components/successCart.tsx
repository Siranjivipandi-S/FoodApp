import { useWindowSize } from "react-use";
import Confetti from "react-confetti";
import success from "../assets/success.gif";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function SuccessCart() {
  const { width, height } = useWindowSize();
  const navigate = useNavigate();
  const [count, setCount] = useState(9);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (count === 0) {
      setFadeOut(true);
      setTimeout(() => {
        navigate("/");
      }, 1000);
    }

    const timeout = setTimeout(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [count, navigate]);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
      {/* Animated circles in background */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Main content card */}
      <div
        className={`z-10 bg-white bg-opacity-95 p-12 rounded-2xl shadow-2xl transform transition-all duration-500 ${
          fadeOut ? "opacity-0 scale-95" : "opacity-100 scale-100"
        } hover:shadow-blue-200/50`}
      >
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Success animation and title */}
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
            <h1 className="font-sans text-slate-800 text-4xl md:text-5xl font-bold text-center">
              Payment Successful!
            </h1>
            <img
              src={success}
              alt="success"
              className="w-24 h-24 md:w-28 md:h-28 animate-bounce"
            />
          </div>

          {/* Thank you message */}
          <p className="text-slate-600 text-center text-lg max-w-md">
            Thank you for your order! Your transaction has been processed
            successfully.
          </p>

          {/* Divider with gradient */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-400 to-transparent my-2"></div>

          {/* Countdown */}
          <div className="flex items-center space-x-2">
            <span className="text-slate-600">Redirecting to</span>
            <Link
              to="/"
              className="font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            >
              Home
            </Link>
            <span className="text-slate-600">in</span>
            <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-bold animate-pulse">
              {count}
            </span>
            <span className="text-slate-600">seconds</span>
          </div>

          {/* Button */}
          <Link
            to="/"
            className="mt-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Return to Home Now
          </Link>
        </div>
      </div>

      {/* Confetti effect */}
      <Confetti
        width={width}
        height={height}
        recycle={count > 0}
        numberOfPieces={200}
        gravity={0.15}
      />
    </div>
  );
}

export default SuccessCart;
