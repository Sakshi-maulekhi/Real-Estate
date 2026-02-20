import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";

function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [postData, setPostData] = useState(null);
  const [postDetail, setPostDetail] = useState(null);
  const [images, setImages] = useState([]);
  const [desc, setDesc] = useState("");
  const [error, setError] = useState("");
  const [hasReplacedImages, setHasReplacedImages] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await apiRequest.get(`/posts/${id}`);
        setPostData(res.data);
        setPostDetail(res.data.postDetail);
        setImages(res.data.images || []);
        setDesc(res.data.postDetail?.desc || "");
      } catch (err) {
        console.log(err);
      }
    };
    fetchPost();
  }, [id]);

  const handleImagesChange = (newImages) => {
    if (!hasReplacedImages) {
      setImages(newImages);
      setHasReplacedImages(true);
    } else {
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiRequest.put(`/posts/${id}`, {
        postData: { ...postData, images },
        postDetail: { ...postDetail, desc },
      });
      navigate("/" + id);
    } catch (err) {
      console.log(err);
      setError("Failed to update post");
    }
  };

  if (!postData || !postDetail)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-950 to-zinc-900 text-white">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-zinc-900 text-white px-6 py-10">

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

        {/* LEFT SIDE */}
        <div className="flex-[2] bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-purple-900/20">

          <h1 className="text-4xl font-bold mb-10 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Edit Post ✨
          </h1>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {[
              { label: "Title", key: "title" },
              { label: "Price", key: "price", type: "number" },
              { label: "Address", key: "address" },
              { label: "City", key: "city" },
              { label: "Bedroom", key: "bedroom", type: "number" },
              { label: "Bathroom", key: "bathroom", type: "number" },
              { label: "Latitude", key: "latitude" },
              { label: "Longitude", key: "longitude" },
            ].map((field) => (
              <div key={field.key} className="flex flex-col gap-2">
                <label className="text-sm text-gray-400">{field.label}</label>
                <input
                  type={field.type || "text"}
                  value={postData[field.key]}
                  onChange={(e) =>
                    setPostData({ ...postData, [field.key]: e.target.value })
                  }
                  className="px-4 py-3 rounded-xl bg-zinc-800 text-white border border-white/10 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
            ))}

            {/* TYPE SELECT */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-400">Type</label>
              <div className="relative">
                <select
                  value={postData.type}
                  onChange={(e) =>
                    setPostData({ ...postData, type: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-zinc-800 text-white border border-white/10 focus:ring-2 focus:ring-purple-500 outline-none appearance-none cursor-pointer"
                >
                  <option className="bg-zinc-900 text-white" value="rent">Rent</option>
                  <option className="bg-zinc-900 text-white" value="buy">Buy</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  ▼
                </div>
              </div>
            </div>

            {/* PROPERTY SELECT */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-400">Property</label>
              <div className="relative">
                <select
                  value={postData.property}
                  onChange={(e) =>
                    setPostData({ ...postData, property: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-zinc-800 text-white border border-white/10 focus:ring-2 focus:ring-purple-500 outline-none appearance-none cursor-pointer"
                >
                  <option className="bg-zinc-800 text-white" value="apartment">Apartment</option>
                  <option className="bg-zinc-800 text-white" value="house">House</option>
                  <option className="bg-zinc-800 text-white" value="condo">Condo</option>
                  <option className="bg-zinc-800 text-white" value="land">Land</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  ▼
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="text-sm text-gray-400">Description</label>
              <div className="bg-white rounded-xl overflow-hidden text-black">
                <ReactQuill value={desc} onChange={setDesc} />
              </div>
            </div>

            <button className="md:col-span-2 mt-6 py-4 rounded-xl font-semibold bg-purple-600 hover:bg-purple-700 transition-all shadow-lg shadow-purple-900/30">
              Update Post
            </button>

            {error && (
              <span className="md:col-span-2 text-red-400 bg-red-900/20 border border-red-500/30 px-4 py-2 rounded-lg">
                {error}
              </span>
            )}

          </form>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl shadow-purple-900/20 flex flex-col gap-6">

          <h2 className="text-xl font-semibold text-gray-300">Images</h2>

          <div className="grid grid-cols-2 gap-4">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
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
            setState={handleImagesChange}
          />

          <p className="text-sm text-gray-400">
            Uploading new images will replace existing ones first, then you can add more.
          </p>

        </div>

      </div>
    </div>
  );
}

export default EditPostPage;