import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { format } from "timeago.js";
import { SocketContext } from "../../context/SocketContext";
import { useNotificationStore } from "../../lib/notificationStore";

function Chat({ chats, userIdToChat }) {
  const [chat, setChat] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);

  const messageEndRef = useRef();

  const decrease = useNotificationStore((state) => state.decrease);

  // Auto-open chat with specified user on mount
  useEffect(() => {
    if (userIdToChat) {
      const initializeChat = async () => {
        try {
          // First, check if a chat already exists with this user
          const existingChat = chats?.find(c => c.receiver.id === userIdToChat);

          if (existingChat) {
            // Chat exists, open it
            handleOpenChat(existingChat.id, existingChat.receiver);
          } else {
            // Chat doesn't exist, create one
            const res = await apiRequest.post("/chats", {
              receiverId: userIdToChat,
            });

            // Get the user details for the receiver
            try {
              const userRes = await apiRequest.get(`/users/${userIdToChat}`);
              const receiver = {
                id: userRes.data.id,
                username: userRes.data.username,
                avatar: userRes.data.avatar,
              };
              setChat({
                ...res.data,
                receiver,
                messages: [],
              });
            } catch (err) {
              console.log("Error fetching user:", err);
              // Fallback if user fetch fails
              setChat({
                ...res.data,
                receiver: { id: userIdToChat },
                messages: [],
              });
            }
          }
        } catch (err) {
          console.log("Error initializing chat:", err);
        }
      };

      initializeChat();
    }
  }, [userIdToChat, chats]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleOpenChat = async (id, receiver) => {
    try {
      const res = await apiRequest.get("/chats/" + id);
      setChat({
        ...res.data,
        receiver,
        messages: res.data.messages || []
      });
    } catch (err) {
      console.log("Error opening chat:", err);
      // If chat fails to load, still set it with empty messages
      setChat({
        id,
        receiver,
        messages: [],
        userIDs: [],
        seenBy: [],
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const text = formData.get("text");

    if (!text) return;
    try {
      const res = await apiRequest.post("/messages/" + chat.id, { text });
      setChat((prev) => ({
        ...prev,
        messages: prev.messages ? [...prev.messages, res.data] : [res.data]
      }));
      e.target.reset();
      socket.emit("sendMessage", {
        receiverId: chat.receiver.id,
        data: { ...res.data, chatId: chat.id },
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const read = async () => {
      try {
        await apiRequest.put("/chats/read/" + chat.id);
      } catch (err) {
        console.log(err);
      }
    };

    if (chat && socket) {
      const handleMessage = (data) => {
        if (chat.id === data.chatId) {
          setChat((prev) => ({
            ...prev,
            messages: prev.messages ? [...prev.messages, data] : [data]
          }));
          read();
        }
      };

      socket.on("getMessage", handleMessage);

      return () => {
        socket.off("getMessage", handleMessage);
      };
    }
  }, [socket, chat]);

  return (
    <div className="flex h-[85vh] bg-zinc-900 rounded-2xl overflow-hidden border border-white/10 shadow-xl">

      {/* SIDEBAR */}
      <div className="w-80 bg-zinc-950 border-r border-white/10 flex flex-col">

        <div className="px-5 py-4 border-b border-white/10">
          <h2 className="text-white font-semibold text-lg">Messages</h2>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-black/10">

          {chats?.length > 0 ? (
            chats.map((c) => {
              const isUnread =
                !c.seenBy?.includes(currentUser.id) &&
                c.lastMessage &&
                chat?.id !== c.id;

              return (
                <div
                  key={c.id}
                  onClick={() => handleOpenChat(c.id, c.receiver)}
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition relative ${chat?.id === c.id
                    ? "bg-purple-600/20"
                    : isUnread
                      ? "bg-purple-600/10 hover:bg-purple-600/20"
                      : "hover:bg-white/5"
                    }`}
                >
                  <img
                    src={c.receiver?.avatar || "/noavatar.jpg"}
                    alt=""
                    className={`w-10 h-10 rounded-full object-cover ${isUnread ? "ring-2 ring-purple-500" : ""
                      }`}
                  />

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium truncate ${isUnread ? "text-purple-400" : "text-white"
                        }`}
                    >
                      {c.receiver?.username}
                    </p>

                    <p
                      className={`text-xs truncate ${isUnread ? "text-white font-semibold" : "text-gray-400"
                        }`}
                    >
                      {c.lastMessage || "No messages yet"}
                    </p>
                  </div>

                  {isUnread && (
                    <span className="absolute right-4 w-2.5 h-2.5 bg-purple-500 rounded-full animate-pulse"></span>
                  )}
                </div>
              );
            })
          ) : (

            <p className="p-4 text-gray-400 text-sm">No chats yet</p>
          )}

        </div>
      </div>

      {/* CHAT AREA */}
      {chat && (
        <div className="flex flex-col flex-1 min-w-0 bg-zinc-900">

          {/* HEADER */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-zinc-950">
            <div className="flex items-center gap-3">
              <img
                src={chat.receiver.avatar || "/noavatar.jpg"}
                alt=""
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="text-white font-medium">
                {chat.receiver.username}
              </span>
            </div>

            <button
              onClick={() => setChat(null)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-6 space-y-4 scrollbar-thin scrollbar-thumb-black/10">

            {chat.messages?.length > 0 ? (
              chat.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.userId === currentUser.id
                    ? "justify-end"
                    : "justify-start"
                    }`}
                >
                  <div
                    className={`max-w-[80%] break-words whitespace-normal px-4 py-3 rounded-2xl text-sm shadow ${message.userId === currentUser.id
                      ? "bg-purple-600 text-white rounded-br-sm"
                      : "bg-zinc-800 text-gray-200 rounded-bl-sm"
                      }`}
                  >
                    <p>{message.text}</p>
                    <span className="block text-xs opacity-60 mt-1">
                      {format(message.createdAt)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 text-sm">
                No messages yet
              </p>
            )}

            <div ref={messageEndRef} />
          </div>

          {/* INPUT */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-3 px-6 py-4 border-t border-white/10 bg-zinc-950"
          >
            <input
              name="text"
              placeholder="Type a message..."
              className="flex-1 bg-zinc-800 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 transition px-5 py-2 rounded-full text-sm font-medium"
            >
              Send
            </button>
          </form>

        </div>
      )}

    </div>
  );


}

export default Chat;
