import React, { useState } from "react";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { LoginDispatch } from "../../Redux/loginslice";
import { useNavigate, Link } from "react-router-dom";
import { setToken } from "../../Redux/TokenSlice";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type HookformType = z.infer<typeof schema>;

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const {
    formState: { errors },
    handleSubmit,
    register,
    setError,
  } = useForm<HookformType>({
    defaultValues: {
      email: "test@gmail.com",
    },
    resolver: zodResolver(schema),
  });

  const submitform: SubmitHandler<HookformType> = async (data) => {
    setIsLoggingIn(true);
    try {
      const res = await dispatch(
        LoginDispatch({ email: data.email, password: data.password })
      );

      if (res) {
        try {
          await dispatch(setToken({ token: res?.payload?.token }));
        } catch (error) {
          console.log("Token Not Stored");
        }
      }

      if (res.error) {
        if (res.error?.message.includes("email")) {
          setError("email", { type: "custom", message: "Invalid email" });
        } else {
          setError("password", { type: "custom", message: "Invalid password" });
        }
      } else {
        if (data.email === "siranjivi@gmail.com") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      setError("password", { type: "custom", message: "Invalid password" });
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">
          Welcome <span className="text-orange-400">Back</span>
        </h1>
        <p className="text-slate-400 mt-2">
          Sign in to continue your experience
        </p>
      </div>

      <form onSubmit={handleSubmit(submitform)} className="space-y-5">
        <div className="space-y-1">
          <div className="flex items-center bg-slate-900/50 rounded-lg px-4 py-2 border border-slate-700 focus-within:border-orange-400 transition-all">
            <Mail className="text-slate-400 w-5 h-5 mr-3" />
            <input
              {...register("email")}
              type="email"
              placeholder="Email Address"
              className="bg-transparent w-full outline-none text-white placeholder:text-slate-400"
            />
          </div>
          {errors.email && (
            <p className="text-red-400 text-sm pl-2">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <div className="flex items-center bg-slate-900/50 rounded-lg px-4 py-2 border border-slate-700 focus-within:border-orange-400 transition-all">
            <Lock className="text-slate-400 w-5 h-5 mr-3" />
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="bg-transparent w-full outline-none text-white placeholder:text-slate-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400 hover:text-slate-300"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-400 text-sm pl-2">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-sm text-orange-400 hover:underline"
          >
            Forgot password?
          </Link>
        </div> */}

        <button
          type="submit"
          disabled={isLoggingIn}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-lg font-medium text-lg hover:opacity-90 transition-all flex items-center justify-center"
        >
          {isLoggingIn ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <div className="text-center text-slate-400 text-sm">
        Don't have an account?{" "}
        <Link to="/Landing/Signup" className="text-orange-400 hover:underline">
          Register
        </Link>
      </div>
    </div>
  );
}

export default LoginPage;
