const express = require("express");
const app = express();

const authRouter = require("./controllers/authController");
const userRouter = require("./controllers/userController");
const chatRouter = require("./controllers/chatController");
const messageRouter = require("./controllers/messageController");

//use auth controller router
app.use(express.json({
    limit: "50mb"
}));
const server = require("http").createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

const onlineUser = [];

//TEST SOCKET CONNECTION from CLIENT
io.on("connection", (socket) => {
  socket.on("join-room", (userId) => {
    socket.join(userId);
  });

  socket.on("send-message", (message) => {
    io.to(message.members[0])
      .to(message.members[1])
      .emit("recieve-message", message);
  });

  socket.on("clear-unread-messages", (data) => {
    io.to(data.members[0])
      .to(data.members[1])
      .emit("message-count-cleared", data);
  });

  socket.on("user-typing", (data) => {
    io.to(data.members[0])
      .to(data.members[1])
      .emit("started-typing", data);
  });

  socket.on("user-login", userId => {
    if(!onlineUser.includes(userId)){
        onlineUser.push(userId)
    }
    socket.emit("online-users", onlineUser)
  });

  socket.on("user-logout", userId => {
    onlineUser.splice(onlineUser.indexOf(userId), 1);
    io.emit('online-user-updated', onlineUser);
  })
});

module.exports = server;
