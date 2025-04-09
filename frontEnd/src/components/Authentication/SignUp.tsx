import React from "react";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { signupDispatch } from "../../Redux/loginslice";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Mail, Lock } from "lucide-react";

const schema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type HookformType = z.infer<typeof schema>;

function SignUp() {
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    setError,
    register,
  } = useForm<HookformType>({
    resolver: zodResolver(schema),
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitform: SubmitHandler<HookformType> = async (data) => {
    try {
      await dispatch(
        signupDispatch({
          email: data.email,
          password: data.password,
          username: data.username,
        })
      );
      navigate("/Landing/login");
    } catch (error) {
      setError("root", {
        message: "Email is not valid",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">
          Create an <span className="text-orange-400">Account</span>
        </h1>
        <p className="text-slate-400 mt-2">
          Join us to get started with your journey
        </p>
      </div>

      <form onSubmit={handleSubmit(submitform)} className="space-y-5">
        <div className="space-y-1">
          <div className="flex items-center bg-slate-900/50 rounded-lg px-4 py-2 border border-slate-700 focus-within:border-orange-400 transition-all">
            <UserPlus className="text-slate-400 w-5 h-5 mr-3" />
            <input
              {...register("username")}
              type="text"
              placeholder="Username"
              className="bg-transparent w-full outline-none text-white placeholder:text-slate-400"
            />
          </div>
          {errors.username && (
            <p className="text-red-400 text-sm pl-2">
              {errors.username.message}
            </p>
          )}
        </div>

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
              type="password"
              placeholder="Password (min 8 characters)"
              className="bg-transparent w-full outline-none text-white placeholder:text-slate-400"
            />
          </div>
          {errors.password && (
            <p className="text-red-400 text-sm pl-2">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-400 text-white py-3 rounded-lg font-medium text-lg hover:opacity-90 transition-all flex items-center justify-center"
        >
          {isSubmitting ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <div className="text-center text-slate-400 text-sm">
        Already have an account?{" "}
        <Link to="/Landing/login" className="text-orange-400 hover:underline">
          Log in
        </Link>
      </div>
    </div>
  );
}

export default SignUp;
