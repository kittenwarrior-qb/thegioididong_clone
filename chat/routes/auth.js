import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !password) return res.status(400).json({ success:false, message: "Thiếu thông tin" });

  const existing = await User.findOne({ username });
  if (existing) return res.status(400).json({ success:false, message: "Username đã tồn tại" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hashed });
  
  const accessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
  const refreshToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "30d" });

  res.json({ success:true, message: "Đăng ký thành công", data: { accessToken, refreshToken, user: { username, email } } });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ success:false, message: "User không tồn tại" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ success:false, message: "Sai mật khẩu" });

  const accessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
  const refreshToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "30d" });

  res.json({ success:true, message: "Đăng nhập thành công", data: { accessToken, refreshToken, user: { username:user.username, email:user.email } } });
});

router.post("/google", async (req, res) => {
  const { credential } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload; // sub là Google unique ID

    if (!email) return res.status(400).json({ success: false, message: "Email Google không tồn tại" });

    // Tìm user theo email
    let user = await User.findOne({ email });

    // Nếu chưa có, tạo user mới
    if (!user) {
      user = await User.create({
        username: name || email.split("@")[0],
        email,
        password: googleId, // Lưu tạm hashed googleId hoặc một string ngẫu nhiên
      });
    }

    const accessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const refreshToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "30d" });

    res.json({
      success: true,
      message: "Đăng nhập Google thành công",
      data: {
        accessToken,
        refreshToken,
        user: { username: user.username, email: user.email },
      },
    });
  } catch (err) {
    console.error("Google token verification failed:", err);
    res.status(400).json({ success: false, message: "Google login thất bại", error: err });
  }
});


export default router;
