import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";

function Login() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const formData = new FormData(e.target);

    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const res = await apiRequest.post("/auth/login", {
        username,
        password,
      });

      updateUser(res.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-950 to-zinc-900 px-6">

      <div className="w-full max-w-2xl flex rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl shadow-purple-900/20">

        {/* LEFT SIDE - FORM */}
        <div className="flex-1 p-8 flex flex-col justify-center text-white">

          <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Welcome Back 👋
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            <input
              name="username"
              required
              minLength={3}
              maxLength={20}
              type="text"
              placeholder="Username"
              className="px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />

            <input
              name="password"
              type="password"
              required
              placeholder="Password"
              className="px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />

            <button
              disabled={isLoading}
              className="py-3 rounded-lg font-semibold bg-purple-600 hover:bg-purple-700 transition-all duration-300 disabled:bg-purple-900/40 disabled:cursor-not-allowed shadow-md shadow-purple-900/30"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>

            {error && (
              <span className="text-red-400 text-sm bg-red-900/20 border border-red-500/30 px-3 py-2 rounded-lg">
                {error}
              </span>
            )}

            <Link
              to="/register"
              className="text-sm text-gray-400 hover:text-purple-400 transition-colors w-max"
            >
              Don’t have an account? Register
            </Link>

          </form>
        </div>

        {/* RIGHT SIDE - IMAGE */}
        <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-purple-900/40 to-black relative">
          <img
            src="/bg.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-15"
          />
          <div className="relative z-10 text-center px-8">
            <h2 className="text-2xl font-bold text-white mb-3">
              Find Your Perfect Place
            </h2>
            <p className="text-gray-300 text-sm">
              Login to explore properties, save favorites and chat with owners.
            </p>
          </div>
        </div>

      </div>
    </div>

  );
}

export default Login;
