import express from "express";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken.js";

const router = express.Router();

router.get("/auth", verifyFirebaseToken, async (req, res) => {
  res.json({
    message: "Welcome!",
    user: req.user,
  });
});

export default router;
