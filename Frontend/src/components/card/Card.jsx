import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";

function Card({ item }) {
  const { currentUser } = useContext(AuthContext);
  const isOwner = currentUser?.id === item.userId;

  
  const storageKey = currentUser
    ? `savedPosts_${currentUser.id}`
    : null;

 
  const [saved, setSaved] = useState(() => {
    if (!storageKey) return false;

    const savedPosts =
      JSON.parse(localStorage.getItem(storageKey)) || [];

    return savedPosts.includes(item.id);
  });

  
  const handleSave = async () => {
    if (!currentUser) return;

    try {
      setSaved((prev) => {
        const newState = !prev;

        const savedPosts =
          JSON.parse(localStorage.getItem(storageKey)) || [];

        let updatedPosts;

        if (newState) {
          // Prevent duplicates
          updatedPosts = savedPosts.includes(item.id)
            ? savedPosts
            : [...savedPosts, item.id];
        } else {
          updatedPosts = savedPosts.filter(
            (id) => id !== item.id
          );
        }

        localStorage.setItem(
          storageKey,
          JSON.stringify(updatedPosts)
        );

        return newState;
      });

      // Backend sync (optional but recommended)
      await apiRequest.post("/posts/save", {
        postId: item.id,
      });

    } catch (err) {
      console.log(err.response?.data || err);

      // Rollback UI if API fails
      setSaved((prev) => !prev);
    }
  };

  
  const handleDelete = async () => {
    try {
      await apiRequest.delete(`/posts/${item.id}`);

      // Also remove from saved list if exists
      if (storageKey) {
        const savedPosts =
          JSON.parse(localStorage.getItem(storageKey)) || [];

        const updatedPosts = savedPosts.filter(
          (id) => id !== item.id
        );

        localStorage.setItem(
          storageKey,
          JSON.stringify(updatedPosts)
        );
      }

      window.location.reload();
    } catch (err) {
      console.log(err.response?.data || err);
    }
  };

  return (
    <div className="glass-card intensive-glow overflow-hidden transition hover:scale-[1.01]">
      <div className="flex flex-col sm:flex-row">

        {/* IMAGE */}
        <Link
          to={`/${item.id}`}
          className="sm:w-56 w-full h-52 sm:h-44 flex-shrink-0 overflow-hidden"
        >
          <img
            src={item.images[0]}
            alt={item.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* CONTENT */}
        <div className="flex flex-col justify-between flex-1 p-4 sm:p-5">

          {/* TOP */}
          <div className="space-y-2">
            <Link
              to={`/${item.id}`}
              className="text-lg sm:text-xl font-semibold text-white hover:text-purple-300 transition"
            >
              {item.title}
            </Link>

            <div className="flex items-center gap-2 text-sm text-gray-300">
              <img
                src="/pin.png"
                alt="location"
                className="w-4 h-4 opacity-80"
              />
              <span className="truncate">
                {item.address}
              </span>
            </div>

            <div className="inline-flex items-center bg-amber-200 text-amber-900 text-sm font-semibold px-3 py-1 rounded-md mt-2">
              ${item.price.toLocaleString()}
            </div>
          </div>

          {/* BOTTOM */}
          <div className="flex items-center justify-between mt-4">

            {/* FEATURES */}
            <div className="flex items-center gap-6 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <img
                  src="/bed.png"
                  alt="bed"
                  className="w-4 h-4 opacity-80"
                />
                <span>{item.bedroom} bed</span>
              </div>

              <div className="flex items-center gap-2">
                <img
                  src="/bath.png"
                  alt="bath"
                  className="w-4 h-4 opacity-80"
                />
                <span>{item.bathroom} bath</span>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-2">

              {/* SAVE BUTTON */}
              <button
                onClick={handleSave}
                className={`p-2 rounded-lg transition flex items-center justify-center ${
                  saved
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-900/40"
                    : "bg-white/5 text-gray-300 hover:bg-purple-500/20"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={saved ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-3 h-3"
                >
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
              </button>

              {/* OWNER ACTIONS */}
             {isOwner && ( <> <Link to={`/edit/${item.id}`} className="p-2 rounded-lg bg-white/5 hover:bg-purple-500/20 transition flex items-center justify-center" > <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3" > <path d="M12 20h9" /> <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" /> </svg> </Link> <button onClick={handleDelete} className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 transition flex items-center justify-center" > <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3" > <path d="M3 6h18" /> <path d="M8 6V4h8v2" /> <path d="M19 6l-1 14H6L5 6" /> <path d="M10 11v6" /> <path d="M14 11v6" /> </svg> </button> </> )} <Link to={`/profile?chatWith=${item.userId}`} className="p-2 rounded-lg bg-white/5 hover:bg-purple-500/20 transition flex items-center justify-center" > <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3" > <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" /> </svg> </Link>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;