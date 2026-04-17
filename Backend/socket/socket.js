import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "https://real-estate-zx4p.onrender.com",
  },
});

let onlineUser = [];

const addUser = (userId, socketId) => {
  if (!onlineUser.some((user) => user.userId === userId)) {
    onlineUser.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  onlineUser = onlineUser.filter(
    (user) => user.socketId !== socketId
  );
};

const getUser = (userId) => {
  return onlineUser.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
    console.log("Online users:", onlineUser);
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
    removeUser(socket.id);
    console.log("🔴 User disconnected:", socket.id);
  });
});


console.log("Socket server running on port 4001");
