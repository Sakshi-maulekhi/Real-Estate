import Chat from "../../components/chat/Chat";
import List from "../../components/list/List";
import apiRequest from "../../lib/apiRequest";
import {
  Await,
  Link,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Suspense, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function ProfilePage() {
  const data = useLoaderData();
  const { updateUser, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const chatWithUserId = searchParams.get("chatWith");

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex h-screen bg-black text-white">

      {/* LEFT PANEL */}
      <div className="w-1/2 overflow-y-auto border-r border-white/10 p-8 space-y-10">

        {/* USER INFO */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-2xl font-semibold">User Information</h1>

            <Link to="/profile/update">
              <button className="bg-purple-600 hover:bg-purple-700 transition px-4 py-2 rounded-lg text-sm">
                Update Profile
              </button>
            </Link>
          </div>

          <div className="space-y-3">
            <img
              src={currentUser.avatar || "/noavatar.jpg"}
              className="w-24 h-24 rounded-full object-cover"
              alt=""
            />
            <p>
              Username: <b>{currentUser.username}</b>
            </p>
            <p>
              Email: <b>{currentUser.email}</b>
            </p>

            <button
              onClick={handleLogout}
              className="mt-4 bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded-lg text-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {/* MY LIST */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold">My List</h1>

            <Link to="/add">
              <button className="bg-green-600 hover:bg-green-700 transition px-4 py-2 rounded-lg text-sm">
                Create New Post
              </button>
            </Link>
          </div>

          <Suspense fallback={<p>Loading...</p>}>
            <Await resolve={data.postResponse}>
              {(postResponse) => (
                <List posts={postResponse.data.userPosts} />
              )}
            </Await>
          </Suspense>
        </div>

        {/* SAVED LIST */}
        <div>
          <h1 className="text-xl font-semibold mb-4">Saved List</h1>

          <Suspense fallback={<p>Loading...</p>}>
            <Await resolve={data.postResponse}>
              {(postResponse) => (
                <List posts={postResponse.data.savedPosts} />
              )}
            </Await>
          </Suspense>
        </div>

      </div>

      {/* RIGHT PANEL - CHAT */}
      <div className="w-1/2 h-full">
        <Suspense fallback={<p className="p-6">Loading...</p>}>
          <Await resolve={data.chatResponse}>
            {(chatResponse) => (
              <Chat
                chats={chatResponse.data}
                userIdToChat={chatWithUserId}
              />
            )}
          </Await>
        </Suspense>
      </div>

    </div>
  );
}

export default ProfilePage;
