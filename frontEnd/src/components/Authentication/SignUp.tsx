import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { signupDispatch } from "../../Redux/loginslice";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
});
type HookformType = z.infer<typeof schema>;

function SignUp() {
  const {
    formState: { errors },
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
        message: "Mail is Not Foung",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-5 gap-10 p-5">
      <h1 className="text-4xl text-center text-white">
        Register <span className="text-orange-300">Page</span>
      </h1>
      <form
        className="flex flex-col items-center justify-center gap-5"
        onSubmit={handleSubmit(submitform)}
      >
        <div className="flex gap-5 items-center justify-center">
          <label htmlFor="username" className="text-xl text-white select-none">
            Username
          </label>
          <input
            {...register("username", { required: true })}
            type="text"
            id="username"
            placeholder="Enter Username"
            className="bg-transparent outline-none border-b-2 border-orange-400 placeholder:text-white text-white selection:bg-orange-300"
          />
        </div>
        <div className="flex gap-5 items-center justify-center">
          <label htmlFor="email" className="text-xl text-white select-none">
            Email
          </label>
          <input
            {...register("email", { required: true })}
            type="text"
            id="email"
            placeholder="Enter Email"
            className="bg-transparent outline-none border-b-2 border-orange-400 placeholder:text-white text-white selection:bg-orange-300"
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-start">{errors.email.message}</p>
        )}
        <div className="flex gap-5">
          <label htmlFor="pass" className="text-xl text-white select-none">
            Password
          </label>
          <input
            {...register("password", { required: true })}
            type="password"
            id="pass"
            placeholder="Enter Password"
            className="bg-transparent outline-none border-b-2 border-orange-400 placeholder:text-white text-white selection:bg-orange-300"
          />
        </div>
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}
        <button
          type="submit"
          className="block mt-2 bg-blue-600 p-2 rounded-xl w-56 text-white text-2xl hover:scale-105 transition-transform hover:bg-blue-500"
        >
          Create Account
        </button>
      </form>
    </div>
  );
}

export default SignUp;
