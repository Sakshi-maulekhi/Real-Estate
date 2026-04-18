import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import authRoute from "./routes/auth.route.js";
import postRoute from "./routes/post.route.js";
import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.route.js";
import chatRoute from "./routes/chat.route.js";
import messageRoute from "./routes/message.route.js";

const app = express();
const server = http.createServer(app);

// Socket.IO configuration with CORS
const io = new Server(server, {
  cors: {
    origin: [
      "https://real-estate-305448gpi-sakshi-s-projects-f41a1176.vercel.app",
      "http://localhost:5173"
    ],
    credentials: true
  }
});

// CORS middleware - MUST be before routes
const corsOptions = {
  origin: [
    "https://real-estate-305448gpi-sakshi-s-projects-f41a1176.vercel.app",
    "http://localhost:5173"
  ],
  credentials: true
};

app.use(cors(corsOptions));
// Preflight request handling
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

// API Routes with /api prefix
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/test", testRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

// Socket.IO event handlers
let onlineUsers = [];

const addUser = (userId, socketId) => {
  if (!onlineUsers.some((user) => user.userId === userId)) {
    onlineUsers.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUsers.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
    console.log("Online users:", onlineUsers);
  });

  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiver = getUser(receiverId);

    if (!receiver) {
      console.log("⚠️ Receiver not online:", receiverId);
      return;
    }

    io.to(receiver.socketId).emit("getMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
    removeUser(socket.id);
  });
});

const PORT = process.env.PORT || 8800;

server.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}!`);
});
