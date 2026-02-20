import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import { useNavigate, useLoaderData } from "react-router-dom";
import DOMPurify from "dompurify";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";

function SinglePage() {
  const post = useLoaderData();
  const [saved, setSaved] = useState(post.isSaved);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!currentUser) {
      navigate("/login");
    }
    setSaved((prev) => !prev);
    try {
      await apiRequest.post("/users/save", { postId: post.id });
    } catch (err) {
      console.log(err);
      setSaved((prev) => !prev);
    }
  };

  const handleSendMessage = () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    // Redirect to profile page with chatWith query param
    navigate("/profile?chatWith=" + post.userId);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-0 bg-gradient-to-br from-black via-zinc-950 to-zinc-900 text-white overflow-hidden">
      {/* LEFT SIDE - DETAILS */}
      <div className="flex-1 h-full overflow-y-auto custom-scrollbar">
        <div className="p-4 lg:pr-12 lg:pl-5 space-y-8 pb-12">
          {/* IMAGE SLIDER */}
          <div className="glass-card overflow-hidden h-80 lg:h-[400px]">
            <Slider images={post.images} />
          </div>

          <div className="space-y-8">
            {/* TOP INFO */}
            <div className="flex justify-between items-start gap-5 flex-col md:flex-row">
              <div className="space-y-4 flex-1">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  {post.title}
                </h1>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <img src="/pin.png" alt="" className="w-4 h-4 opacity-80 invert" />
                  <span>{post.address}</span>
                </div>
                <div className="bg-purple-900/30 border border-purple-500/30 text-purple-200 rounded-lg px-3 py-1 w-max text-xl font-light shadow-lg shadow-purple-900/20">
                  $ {post.price}
                </div>
              </div>

              {/* USER CARD */}
              <div className="flex flex-col items-center justify-center gap-3 glass-card px-8 py-6 font-semibold min-w-[200px]">
                <img
                  src={post.user.avatar || "/noavatar.jpg"}
                  alt=""
                  className="w-16 h-16 rounded-full object-cover border-2 border-purple-500/30"
                />
                <span className="text-lg">{post.user.username}</span>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div
              className="text-gray-300 leading-relaxed text-sm lg:text-base glass-card p-6"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.postDetail.desc),
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - FEATURES */}
      <div className="flex-1 lg:flex-[0.8] bg-white/5 backdrop-blur-sm border-l border-white/10 h-full overflow-y-auto custom-scrollbar">
        <div className="p-6 flex flex-col gap-8 pb-12">

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-200">General</h3>
            <div className="flex flex-col gap-4 glass-card p-4">
              <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-white/5 transition-colors">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <img src="/utility.png" alt="" className="w-6 h-6 invert opacity-80" />
                </div>
                <div>
                  <span className="font-bold block text-gray-200">Utilities</span>
                  <p className="text-sm text-gray-400">
                    {post.postDetail.utilities === "owner" ? "Owner is responsible" : "Tenant is responsible"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-white/5 transition-colors">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <img src="/pet.png" alt="" className="w-6 h-6 invert opacity-80" />
                </div>
                <div>
                  <span className="font-bold block text-gray-200">Pet Policy</span>
                  <p className="text-sm text-gray-400">
                    {post.postDetail.pet === "allowed" ? "Pets Allowed" : "Pets not Allowed"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-white/5 transition-colors">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <img src="/fee.png" alt="" className="w-6 h-6 invert opacity-80" />
                </div>
                <div>
                  <span className="font-bold block text-gray-200">Property Fees</span>
                  <p className="text-sm text-gray-400">{post.postDetail.income}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-200">Sizes</h3>
            <div className="flex justify-between glass-card p-4">
              <div className="flex flex-col items-center gap-2 flex-1 border-r border-white/10 last:border-0">
                <img src="/size.png" alt="" className="w-6 h-6 invert opacity-80" />
                <span className="text-sm text-gray-300">{post.postDetail.size} sqft</span>
              </div>
              <div className="flex flex-col items-center gap-2 flex-1 border-r border-white/10 last:border-0">
                <img src="/bed.png" alt="" className="w-6 h-6 invert opacity-80" />
                <span className="text-sm text-gray-300">{post.bedroom} beds</span>
              </div>
              <div className="flex flex-col items-center gap-2 flex-1">
                <img src="/bath.png" alt="" className="w-6 h-6 invert opacity-80" />
                <span className="text-sm text-gray-300">{post.bathroom} bath</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-200">Nearby Places</h3>
            <div className="flex justify-between gap-4 glass-card p-4 overflow-x-auto">
              <div className="flex items-center gap-3 min-w-max p-2 rounded-lg hover:bg-white/5 transition-colors">
                <img src="/school.png" alt="" className="w-6 h-6 invert opacity-80" />
                <div>
                  <span className="font-bold block text-gray-200">School</span>
                  <p className="text-sm text-gray-400">{post.postDetail.school > 999 ? (post.postDetail.school / 1000) + "km" : post.postDetail.school + "m"} away</p>
                </div>
              </div>
              <div className="flex items-center gap-3 min-w-max p-2 rounded-lg hover:bg-white/5 transition-colors">
                <img src="/pet.png" alt="" className="w-6 h-6 invert opacity-80" />
                <div>
                  <span className="font-bold block text-gray-200">Bus Stop</span>
                  <p className="text-sm text-gray-400">{post.postDetail.bus}m away</p>
                </div>
              </div>
              <div className="flex items-center gap-3 min-w-max p-2 rounded-lg hover:bg-white/5 transition-colors">
                <img src="/fee.png" alt="" className="w-6 h-6 invert opacity-80" />
                <div>
                  <span className="font-bold block text-gray-200">Restaurant</span>
                  <p className="text-sm text-gray-400">{post.postDetail.restaurant}m away</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-200">Location</h3>
            <div className="h-64 w-full rounded-2xl overflow-hidden glass-card border-none">
              <Map items={[post]} />
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-auto">
            <button
              onClick={handleSendMessage}
              className="btn-primary w-full flex items-center justify-center gap-3 group"
            >
              <img src="/chat.png" alt="" className="w-5 h-5 invert group-hover:scale-110 transition-transform" />
              <span>Send a Message</span>
            </button>
            <button
              onClick={handleSave}
              className={`w-full flex items-center justify-center gap-3 px-6 py-3 rounded-lg font-semibold transition-all duration-300 border border-white/20 hover:bg-white/10 ${saved
                ? "bg-purple-600/50 border-purple-500/50 text-white shadow-lg shadow-purple-900/30"
                : "bg-white/5 text-gray-300"
                }`}
            >
              <img src="/save.png" alt="" className={`w-5 h-5 invert transition-transform ${saved ? "scale-110" : ""}`} />
              {saved ? "Place Saved" : "Save the Place"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SinglePage;
