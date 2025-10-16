import { useState } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { serverURL } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const { email, password } = formData;
      if (!email || !password) {
        toast.error("Please fill in all required fields.");
        return;
      }

      const response = await axios.post(
        `${serverURL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      dispatch(setUserData(response.data.user));
      toast.success("Login successful!");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900 flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-4xl grid md:grid-cols-2 overflow-hidden">
        {/* Left Form Section */}
        <div className="flex flex-col justify-center p-6 sm:p-8 gap-4 overflow-y-auto max-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">Welcome back</h1>
            <p className="text-gray-500 text-sm">Login to your account</p>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block font-medium text-sm text-gray-700 mb-0.5"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full h-10 px-4 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500 text-sm"
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label
              htmlFor="password"
              className="block font-medium text-sm text-gray-700 mb-0.5"
            >
              Password
            </label>
            <input
              id="password"
              type={show ? "text" : "password"}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full h-10 px-4 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500 text-sm"
              placeholder="Enter your password"
            />
            <span
              onClick={() => setShow(!show)}
              className="absolute right-3 bottom-2.5 text-gray-500 cursor-pointer"
            >
              {show ? (
                <IoEyeOutline className="w-5 h-5" />
              ) : (
                <IoEyeOffOutline className="w-5 h-5" />
              )}
            </span>
          </div>

          <button
            onClick={handleLogin}
            className="w-full h-10 bg-black text-white rounded-md text-sm font-medium hover:opacity-90 transition cursor-pointer"
            disabled={loading}
          >
            {loading ? <ClipLoader size={20} color="white" /> : "Login"}
          </button>

          <span
            onClick={() => navigate("/forgot-password")}
            className="text-sm cursor-pointer text-[#585757] text-center"
          >
            Forgot your password?
          </span>

          <div className="flex items-center justify-center gap-3 text-sm text-gray-400">
            <div className="flex-grow h-px bg-gray-300" />
            <span>or</span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>

          <div className="text-[#6f6f6f] text-center">
            Create a new account?{" "}
            <span
              className="underline underline-offset-1 text-black cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              Signup
            </span>
          </div>
        </div>

        {/* Right Logo Section */}
        <div className="bg-black text-white hidden md:flex flex-col items-center justify-center p-6">
          <img src="/logo.png" alt="logo" className="w-28 h-28 mb-4" />
          <h2 className="text-2xl font-semibold">EduNexus</h2>
        </div>
      </div>
    </div>
  );
};

export default Login;
