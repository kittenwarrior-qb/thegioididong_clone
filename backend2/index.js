import express from "express";
import axios from "axios";
import fs from "fs/promises";
import cron from "node-cron";

const app = express();
const PORT = 5000;
const DB_FILE = "db.json";

async function crawlData() {
  try {
    console.log("Đang crawl dữ liệu...");

    const [provincesRes, wardsRes] = await Promise.all([
      axios.get("https://provinces.open-api.vn/api/v2/p"),
      axios.get("https://provinces.open-api.vn/api/v2/w"),
    ]);

    const dbData = {
      provinces: provincesRes.data,
      wards: wardsRes.data,
      updatedAt: new Date().toISOString(),
    };

    await fs.writeFile(DB_FILE, JSON.stringify(dbData, null, 2), "utf-8");
    console.log(" Crawl thành công, dữ liệu đã lưu vào db.json");
  } catch (err) {
    console.error(" Lỗi crawl dữ liệu:", err.message);
  }
}

crawlData();

cron.schedule("0 */3 * * *", () => {
  crawlData();
});

// API test
app.get("/", (req, res) => {
  res.json({ message: "Server đang chạy ", updatedAt: new Date() });
});

app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});
