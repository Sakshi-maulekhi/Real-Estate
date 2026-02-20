import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { useNavigate } from "react-router-dom";
import UploadWidget from "../../components/uploadWidget/UploadWidget";

function ProfileUpdatePage() {
  const { currentUser, updateUser } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [avatar, setAvatar] = useState([]);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);

    try {
      const res = await apiRequest.put(`/users/${currentUser.id}`, {
        username,
        email,
        password,
        avatar: avatar[0],
      });

      updateUser(res.data);
      navigate("/profile");
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-950 to-zinc-900 px-6">

      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 border border-white/10 bg-white/5 backdrop-blur-xl rounded-3xl p-10 shadow-2xl shadow-purple-900/20 text-white">

        {/* LEFT SIDE - FORM */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Update Profile ✨
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-400">Username</label>
              <input
                name="username"
                type="text"
                defaultValue={currentUser.username}
                className="px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-400">Email</label>
              <input
                name="email"
                type="email"
                defaultValue={currentUser.email}
                className="px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-400">New Password</label>
              <input
                name="password"
                type="password"
                placeholder="Enter new password"
                className="px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
            </div>

            <button className="py-4 rounded-xl font-semibold bg-purple-600 hover:bg-purple-700 transition-all duration-300 shadow-lg shadow-purple-900/30">
              Update Profile
            </button>

            {error && (
              <span className="text-red-400 text-sm bg-red-900/20 border border-red-500/30 px-4 py-2 rounded-lg">
                {error}
              </span>
            )}

          </form>
        </div>

        {/* RIGHT SIDE - AVATAR */}
        <div className="flex-1 flex flex-col items-center justify-center gap-6 border-t lg:border-t-0 lg:border-l border-white/10 pt-8 lg:pt-0 lg:pl-8">

          <img
            src={avatar[0] || currentUser.avatar || "/noavatar.jpg"}
            alt=""
            className="w-40 h-40 rounded-full object-cover border-4 border-purple-500/40 shadow-xl shadow-purple-900/30"
          />

          <UploadWidget
            uwConfig={{
              cloudName: "lamadev",
              uploadPreset: "estate",
              multiple: false,
              maxImageFileSize: 2000000,
              folder: "avatars",
            }}
            setState={setAvatar}
          />

        </div>

      </div>
    </div>
  );
}

export default ProfileUpdatePage;
