import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { useNavigate } from "react-router-dom";

function NewPostPage() {
  const [value, setValue] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    try {
      const res = await apiRequest.post("/posts", {
        postData: {
          title: inputs.title,
          price: parseInt(inputs.price),
          address: inputs.address,
          city: inputs.city,
          bedroom: parseInt(inputs.bedroom),
          bathroom: parseInt(inputs.bathroom),
          type: inputs.type,
          property: inputs.property,
          latitude: inputs.latitude,
          longitude: inputs.longitude,
          images: images,
        },
        postDetail: {
          desc: value,
          utilities: inputs.utilities,
          pet: inputs.pet,
          income: inputs.income,
          size: parseInt(inputs.size),
          school: parseInt(inputs.school),
          bus: parseInt(inputs.bus),
          restaurant: parseInt(inputs.restaurant),
        },
      });

      navigate("/" + res.data.id);
    } catch (err) {
      console.log(err);
      setError("Failed to create post");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-zinc-900 text-white px-6 py-10">

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

        {/* LEFT SIDE - FORM */}
        <div className="flex-[2] bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-purple-900/20">

          <h1 className="text-4xl font-bold mb-10 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Add New Post ✨
          </h1>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {[
              { label: "Title", name: "title" },
              { label: "Price", name: "price", type: "number" },
              { label: "Address", name: "address" },
              { label: "City", name: "city" },
              { label: "Bedroom", name: "bedroom", type: "number" },
              { label: "Bathroom", name: "bathroom", type: "number" },
              { label: "Latitude", name: "latitude" },
              { label: "Longitude", name: "longitude" },
              { label: "Income Policy", name: "income" },
              { label: "Total Size (sqft)", name: "size", type: "number" },
              { label: "School", name: "school", type: "number" },
              { label: "Bus", name: "bus", type: "number" },
              { label: "Restaurant", name: "restaurant", type: "number" },
            ].map((field) => (
              <div key={field.name} className="flex flex-col gap-2">
                <label className="text-sm text-gray-400">{field.label}</label>
                <input
                  name={field.name}
                  type={field.type || "text"}
                  className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
            ))}

            {/* Type */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-400">Type</label>
              <select
                name="type"
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-purple-500"
              >
                <option value="rent">Rent</option>
                <option value="buy">Buy</option>
              </select>
            </div>

            {/* Property */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-400">Property</label>
              <select
                name="property"
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-purple-500"
              >
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="land">Land</option>
              </select>
            </div>

            {/* Utilities */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-400">Utilities Policy</label>
              <select
                name="utilities"
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-purple-500"
              >
                <option value="owner">Owner</option>
                <option value="tenant">Tenant</option>
                <option value="shared">Shared</option>
              </select>
            </div>

            {/* Pet */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-400">Pet Policy</label>
              <select
                name="pet"
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-purple-500"
              >
                <option value="allowed">Allowed</option>
                <option value="not-allowed">Not Allowed</option>
              </select>
            </div>

            {/* Description Full Width */}
            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="text-sm text-gray-400">Description</label>
              <div className="bg-white rounded-xl overflow-hidden text-black">
                <ReactQuill theme="snow" onChange={setValue} value={value} />
              </div>
            </div>

            <button className="md:col-span-2 mt-6 py-4 rounded-xl font-semibold bg-purple-600 hover:bg-purple-700 transition-all shadow-lg shadow-purple-900/30">
              Add Post
            </button>

            {error && (
              <span className="md:col-span-2 text-red-400 bg-red-900/20 border border-red-500/30 px-4 py-2 rounded-lg">
                {error}
              </span>
            )}
          </form>
        </div>

        {/* RIGHT SIDE - IMAGE UPLOAD */}
        <div className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl shadow-purple-900/20 flex flex-col gap-6">

          <h2 className="text-xl font-semibold text-gray-300">Images</h2>

          <div className="grid grid-cols-2 gap-4">
            {images.map((image, index) => (
              <img
                src={image}
                key={index}
                alt=""
                className="rounded-xl object-cover h-32 w-full border border-white/10"
              />
            ))}
          </div>

          <UploadWidget
            uwConfig={{
              multiple: true,
              cloudName: "lamadev",
              uploadPreset: "estate",
              folder: "posts",
            }}
            setState={setImages}
          />

        </div>

      </div>
    </div>
  );
}

export default NewPostPage;
