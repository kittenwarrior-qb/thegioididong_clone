import express from "express";
import http from "http";
import { Server } from "socket.io";
import cookie from "cookie";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import admin from "./config/firebase.js"; 
import { verifyFirebaseToken } from "./middlewares/verifyFirebaseToken.js";

dotenv.config();

import authRoutes from "./routes/auth.js";

const app = express();
const server = http.createServer(app);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost",
  "http://172.236.138.136",
  "http://thegioididongclone.duckdns.org",
  "https://thegioididongclone.duckdns.org"
];
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
  next();
});

app.use(express.json());

app.use("/api", authRoutes);

app.get("/api/profile", verifyFirebaseToken, async (req, res) => {
  try {
    const customToken = await admin.auth().createCustomToken(req.user.uid);
    res.json({
      message: "Welcome!",
      user: req.user,
      idToken: req.idToken,
      customToken,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else callback(new Error("Not allowed by CORS"));
    },
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

server.listen(4000, () => console.log("Server running on http://localhost:4000"));
