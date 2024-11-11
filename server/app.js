const express = require("express");
const app = express();

const authRouter = require("./controllers/authController");
const userRouter = require("./controllers/userController");
const chatRouter = require("./controllers/chatController");
const messageRouter = require("./controllers/messageController");

//use auth controller router
app.use(express.json());
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

//TEST SOCKET CONNECTION from CLIENT
io.on("connection", (socket) => {
  socket.on('join-room', userId => {
    socket.join(userId);
  })

  socket.on('send-message', (message) => {
    console.log(message);
    io.to(message.members[0])
      .to(message.members[1])
      .emit('recieve-message', message);
  })
});

module.exports = server;
