import { useState } from "react";

import { useSearchParams } from "react-router-dom";

function Filter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState({
    type: searchParams.get("type") || "",
    city: searchParams.get("city") || "",
    property: searchParams.get("property") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    bedroom: searchParams.get("bedroom") || "",
  });

  const handleChange = (e) => {
    setQuery({
      ...query,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilter = () => {
    setSearchParams(query);
  };

  return (
    <div className="glass-card p-6 space-y-6 sticky top-20">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-white">
          Search results for{" "}
          <span className="gradient-text">{searchParams.get("city") || "all locations"}</span>
        </h2>
        <p className="text-sm text-gray-400 mt-1">Refine your search below</p>
      </div>

      {/* Location Input */}
      <div className="space-y-2">
        <label htmlFor="city" className="block text-sm font-medium text-gray-300">
          Location
        </label>
        <input
          type="text"
          id="city"
          name="city"
          placeholder="Enter city name..."
          onChange={handleChange}
          defaultValue={query.city}
          className="p-1 glass-input w-full bg-zinc-800"
        />
      </div>


      <div className="space-y-4">
        {/* Type */}
        <div className="space-y-2">
          <label htmlFor="type" className="block text-sm font-medium text-gray-300">
            Type
          </label>
          <select
            name="type"
            id="type"
            onChange={handleChange}
            defaultValue={query.type}
            className="p-1 glass-input w-full bg-zinc-800 text-white"
          >
            <option value="">Any</option>
            <option value="buy">Buy</option>
            <option value="rent">Rent</option>
          </select>
        </div>

        {/* Property Type */}
        <div className="space-y-2">
          <label htmlFor="property" className="block text-sm font-medium text-gray-300">
            Property Type
          </label>
          <select
            name="property"
            id="property"
            onChange={handleChange}
            defaultValue={query.property}
            className="p-1 glass-input w-full bg-zinc-800 text-white"
          >
            <option value="">Any</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="condo">Condo</option>
            <option value="land">Land</option>
          </select>
        </div>

        {/* Price Range */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="minPrice" className="block text-sm font-medium text-gray-300">
              Min Price
            </label>
            <input
              type="number"
              id="minPrice"
              name="minPrice"
              placeholder="$0"
              onChange={handleChange}
              defaultValue={query.minPrice}
              className="p-1 glass-input w-full bg-zinc-800"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-300">
              Max Price
            </label>
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              placeholder="Any"
              onChange={handleChange}
              defaultValue={query.maxPrice}
              className="p-1 glass-input w-full bg-zinc-800"
            />
          </div>
        </div>

        {/* Bedroom */}
        <div className="space-y-2">
          <label htmlFor="bedroom" className="block text-sm font-medium text-gray-300">
            Bedrooms
          </label>
          <input
            type="number"
            id="bedroom"
            name="bedroom"
            placeholder="Any"
            onChange={handleChange}
            defaultValue={query.bedroom}
            className="p-1 glass-input w-full bg-zinc-800"
          />
        </div>
      </div>

      {/* Search Button */}
      <button
        onClick={handleFilter}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        <img src="/search.png" alt="search" className="w-4 h-4 invert" />
        <span>Apply Filters</span>
      </button>
    </div>
  );
}

export default Filter;
