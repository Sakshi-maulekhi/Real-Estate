import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useNotificationStore } from "../../lib/notificationStore";

function Navbar() {
  const [open, setOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const fetchNotifications = useNotificationStore((state) => state.fetch);
  const number = useNotificationStore((state) => state.number);

  useEffect(() => {
    if (currentUser) {
      fetchNotifications();
    }
  }, [currentUser, fetchNotifications]);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">

          {/* Left Section */}
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="PropertyHub" className="w-8 h-8" />
              <span className="hidden sm:block font-bold text-lg text-white">
                PropertyHub
              </span>
            </Link>

            <div className="hidden md:flex gap-8 text-sm text-gray-300">
              <Link to="/" className="hover:text-purple-400 transition">
                Home
              </Link>
              <Link to="/" className="hover:text-purple-400 transition">
                About
              </Link>
              <Link to="/" className="hover:text-purple-400 transition">
                Contact
              </Link>
              <Link to="/" className="hover:text-purple-400 transition">
                Agents
              </Link>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-6">

            {currentUser ? (
              <div className="flex items-center gap-4">
                <img
                  src={currentUser.avatar || "/noavatar.jpg"}
                  alt={currentUser.username}
                  className="w-10 h-10 rounded-full border border-purple-500/40 object-cover"
                />

                <div className="hidden sm:flex flex-col">
                  <span className="text-sm font-semibold text-white">
                    {currentUser.username}
                  </span>

                  <Link
                    to="/profile"
                    className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-2"
                  >
                    {number > 0 && (
                      <span className="flex items-center justify-center w-5 h-5 text-xs rounded-full bg-purple-600 shadow-md shadow-purple-500/40">
                        {number}
                      </span>
                    )}
                    Profile
                  </Link>
                </div>
              </div>
            ) : (
              <div className="hidden sm:flex gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm rounded-xl bg-white/10 hover:bg-white/20 transition"
                >
                  Sign in
                </Link>

                <Link
                  to="/register"
                  className="px-4 py-2 text-sm rounded-xl bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/30 transition"
                >
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile Toggle */}
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="md:hidden p-4 rounded-lg hover:bg-white/10 transition"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden mt-4 space-y-2 border-t border-white/10 pt-4">
            {["Home", "About", "Contact", "Agents"].map((item) => (
              <Link
                key={item}
                to="/"
                className="block px-4 py-2 rounded-xl text-gray-300 hover:text-purple-400 hover:bg-white/10 transition"
              >
                {item}
              </Link>
            ))}

            {!currentUser && (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-2 rounded-xl text-gray-300 hover:bg-white/10 transition"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-2 rounded-xl bg-purple-600 text-white shadow-md shadow-purple-500/40"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
