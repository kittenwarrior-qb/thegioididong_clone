import express from "express";
import http from "http";
import { Server } from "socket.io";
import cookie from "cookie";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  const cookies = socket.handshake.headers.cookie || "";
  const parsedCookies = cookie.parse(cookies);
  const role = parsedCookies.admin === "true" ? "admin" : "user";

  console.log(`User connected: ${socket.id}, role: ${role}`);

  if (!io.sockets.messages) io.sockets.messages = [];
  socket.emit("load_messages", io.sockets.messages);

  socket.on("send_message", (data) => {
    const msg = { user: role, text: data.text };
    io.sockets.messages.push(msg);

    io.emit("receive_message", msg);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(4000, () => console.log("Socket server running on 4000"));
