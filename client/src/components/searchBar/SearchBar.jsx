import { useState } from "react";
import "./searchBar.scss";
import { Link } from "react-router-dom";

const types = ["buy", "rent"];

function SearchBar() {
  const [query, setQuery] = useState({
    type: "buy",
    city: "",
    minPrice: 0,
    maxPrice: 0,
  });

  const switchType = (val) => {
    setQuery((prev) => ({ ...prev, type: val }));
  };

  const handleChange = (e) => {
    setQuery((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="space-y-4">
      {/* Type Selector */}
      <div className="flex gap-3 flex-wrap ">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => switchType(type)}
            className={` px-3 rounded-lg font-semibold transition-all duration-300 ${query.type === type
              ? "bg-purple-600 text-white"
              : "bg-white/10 hover:bg-white/20 text-gray-300 hover:text-purple-400"
              }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Search Form */}
      <form className="glass-card p-6 space-y-4">
        {/* Location Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Location
          </label>
          <input
            type="text"
            name="city"
            placeholder="Search by city..."
            onChange={handleChange}
            className="p-1 glass-input w-full"
          />
        </div>

        {/* Price Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Min Price
            </label>
            <input
              type="number"
              name="minPrice"
              min={0}
              max={10000000}
              placeholder="$0"
              onChange={handleChange}
              className="p-1 glass-input w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Max Price
            </label>
            <input
              type="number"
              name="maxPrice"
              min={0}
              max={10000000}
              placeholder="Any"
              onChange={handleChange}
              className="p-1 glass-input w-full"
            />
          </div>
        </div>

        {/* Search Button */}
        <Link
          to={`/list?type=${query.type}&city=${query.city}&minPrice=${query.minPrice}&maxPrice=${query.maxPrice}`}
          className="w-full flex items-center justify-center gap-3 px-8 py-3 text-base font-semibold rounded-xl bg-purple-700 hover:bg-purple-700 transition shadow-lg shadow-purple-500/40"
        >
          <button
            className="w-full flex items-center justify-center gap-3 
  px-1 py-1 rounded-2xl
  bg-purple-700 hover:bg-purple-700
  text-white font-semibold text-base
  transition-all duration-300
  shadow-md hover:shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>

            <span>Search Properties</span>
          </button>

        </Link>
      </form>
    </div>
  );
}

export default SearchBar;
