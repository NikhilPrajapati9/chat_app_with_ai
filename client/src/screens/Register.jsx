import React, { useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import axios from "../config/axios";
import { useUser } from "../context/user.context";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // // Basic validation
    if (!email || !password) {
      setLoading(false);
      toast.error("Please fill in all required fields");
      return;
    }

    axios
      .post("/users/register", {
        email,
        password,
      })
      .then((res) => {
        localStorage.setItem("token", res.data.data.token);
        setUser(res.data.data.user);
        toast.success("Register Successful");
        setLoading(false);
        navigate("/");
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response.data);
        console.log(err.response.data);
      });
  };
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-900 via-violet-800 to-blue-700 p-4">
      <div className="w-full max-w-md">
        <div className="backdrop-blur-sm bg-white/10 rounded-2xl px-8 pt-8 pb-4 shadow-xl border border-white/10">
          <div className="flex justify-center mb-4">
            <div className="h-24 w-24 rounded-full bg-white/10 flex items-center justify-center">
              <User className="h-12 w-12 text-white/70" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}

            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-white/60">
                <Mail size={18} />
              </div>
              <input
                type="email"
                className="w-full py-3 pl-10 pr-3 bg-transparent border-b border-white/30 focus:border-white/70 text-white placeholder-white/60 outline-none transition-colors"
                placeholder="Email ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {/* Password Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-white/60">
                <Lock size={18} />
              </div>
              <input
                type="password"
                className="w-full py-3 pl-10 pr-3 bg-transparent border-b border-white/30 focus:border-white/70 text-white placeholder-white/60 outline-none transition-colors"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className={`w-full cursor-pointer mt-5 py-3 px-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500 text-white rounded-lg shadow-lg hover:from-purple-700 hover:via-indigo-700 hover:to-blue-600 transition-all duration-300 font-medium ${
                loading ? "cursor-not-allowed bg-gray-600" : null
              }}`}
              disabled={loading}
            >
              {loading ? <Loader className="animate-spin" /> : "Register"}
            </button>
          </form>

          <div className="text-center mt-4 mb-0">
            <p className="text-white">
              Already have an account?{" "}
              <Link to={"/login"} className="text-blue-400">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
