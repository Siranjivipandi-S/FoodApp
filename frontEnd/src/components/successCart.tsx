import { useWindowSize } from "react-use";
import Confetti from "react-confetti";
import success from "../assets/success.gif";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
function SuccessCart() {
  const { width, height } = useWindowSize();
  const navigate = useNavigate();
  const [count, SetCount] = useState(9);
  useEffect(() => {
    if (count == 0) {
      navigate("/");
    }
    const timeout = setTimeout(() => {
      SetCount((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [count, navigate]);
  return (
    <>
      <div className="min-h-screen w-full flex items-center justify-center shadow-xl bg-slate-600 rounded-lg ">
        <div className="bg-white z-10 h-[150px] w-full/2 p-10 flex flex-col items-center justify-center rounded-lg">
          <div className="flex items-center justify-center">
            <h1 className="font-sans text-black text-4xl hover:scale-105 transition-transform">
              Payment Success
            </h1>
            <img src={success} alt="success" className="w-[100px] h-[100px]" />
          </div>
          <h3>
            Redirected to <Link to={"/"}>Home</Link> in
            <span> {count}s</span>
          </h3>
        </div>
      </div>
      <Confetti width={width} height={height} />
    </>
  );
}

export default SuccessCart;
