import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";
import cron from "node-cron";
import pLimit from "p-limit";

const BASE_URL = "https://www.thegioididong.com";

async function crawlCategories() {
  try {
    const { data } = await axios.get(BASE_URL);
    const $ = cheerio.load(data);

    const categories = [];

    $(".main-menu li a").each((i, el) => {
      const name = $(el).text().trim();
      const link = $(el).attr("href");
      if (name && link && link.startsWith("/")) {
        categories.push({
          id: i + 1,
          name,
          link: BASE_URL + link,
        });
      }
    });

    console.log(`Lưu ${categories.length} category`);
    return categories;
  } catch (error) {
    console.error("Lỗi crawl categories:", error.message);
    return [];
  }
}

async function crawlProducts(categories) {
  let products = [];
  let fallbackId = 1;

  const limit = pLimit(5);

  const tasks = categories.map((cate) =>
    limit(async () => {
      try {
        console.log(`Crawl category: ${cate.name}`);
        const { data } = await axios.get(cate.link);
        const $ = cheerio.load(data);

        $(".item, li.item").each((i, el) => {
          const item = $(el);
          const anchor = item.find("a").first();

          const dataId = anchor.attr("data-id");
          const name = anchor.attr("data-name") || item.find("h3").text().trim() || null;
          const price = anchor.attr("data-price") || item.find(".price").text().trim();
          const priceOld = item.find(".price-old").text().trim() || null;
          const percent = item.find(".percent").text().trim() || item.find(".price-and-discount small").text().trim() || null;
          const img = item.find("img").attr("data-src") || item.find("img").attr("src") || null;
          const brand = anchor.attr("data-brand") || "";
          const category = anchor.attr("data-cate") || cate.name || "";

          const rating = item.find(".vote-txt b").text().trim() || null;
          const sold = item.find(".rating_Compare span").text().replace("•", "").trim() || null;
          const isFlashSale = (anchor.attr("data-box") || "").includes("Flashsale");
          const tags = [];
          item.find(".item-compare span").each((_, span) => {
            const t = $(span).text().trim();
            if (t) tags.push(t);
          });

          const isNew = item.find(".ln-new, .newModel").length > 0;
          const isLoan = item.find(".lb-tragop").length > 0;
          const isOnline = item.find(".item-txt-online").length > 0;
          const isUpComming = item.find(".upcomming").length > 0;

          const href = anchor.attr("href");
          const link = href ? (href.startsWith("http") ? href : BASE_URL + href) : null;

          products.push({
            id: dataId ? Number(dataId) : fallbackId++,
            name,
            price,
            priceOld,
            percent,
            brand,
            category,
            img,
            rating,
            sold,
            isFlashSale,
            tags,
            isNew,
            isLoan,
            isOnline,
            isUpComming,
            link,
          });
        });
      } catch (error) {
        console.error(`Lỗi crawl category ${cate.name}:`, error.message);
      }
    })
  );

  await Promise.all(tasks);
  console.log(`Lưu ${products.length} sản phẩm từ categories`);
  return products;
}

async function crawlHomeProducts() {
  try {
    console.log("Crawl products từ trang Home");
    const { data } = await axios.get(BASE_URL);
    const $ = cheerio.load(data);

    const products = [];
    let fallbackId = 1;

    $(".item, li.item").each((i, el) => {
      const item = $(el);
      const anchor = item.find("a").first();

      const dataId = anchor.attr("data-id");
      const name = anchor.attr("data-name") || item.find("h3").text().trim() || null;
      const price = anchor.attr("data-price") || item.find(".price").text().trim();
      const priceOld = item.find(".price-old").text().trim() || null;
      const percent = item.find(".percent").text().trim() || item.find(".price-and-discount small").text().trim() || null;
      const img = item.find("img").attr("data-src") || item.find("img").attr("src") || null;
      const brand = anchor.attr("data-brand") || "";
      const category = "Home";

      const rating = item.find(".vote-txt b").text().trim() || null;
      const flashSaleCount = item.find(".rq_count b").text().trim() || null;
      const sold = item.find(".rating_Compare span").text().replace("•", "").trim() || null;
      const isFlashSale = (anchor.attr("data-box") || "").includes("Flashsale");
      const tags = [];
      item.find(".item-compare span").each((_, span) => {
        const t = $(span).text().trim();
        if (t) tags.push(t);
      });

      const isNew = item.find(".ln-new, .newModel").length > 0;
      const isLoan = item.find(".lb-tragop").length > 0;
      const isOnline = item.find(".item-txt-online").length > 0;
      const isUpComming = item.find(".upcomming").length > 0;

      const href = anchor.attr("href");
      const link = href ? (href.startsWith("http") ? href : BASE_URL + href) : null;


      products.push({
        id: dataId ? Number(dataId) : fallbackId++,
        name,
        price,
        priceOld,
        percent,
        brand,
        category,
        img,
        rating,
        flashSaleCount,
        sold,
        isFlashSale,
        tags,
        isNew,
        isLoan,
        isOnline,
        isUpComming,
        link,
      });
    });

    console.log(`Lưu ${products.length} sản phẩm từ Home`);
    return products;
  } catch (error) {
    console.error("Lỗi crawl products từ Home:", error.message);
    return [];
  }
}

async function crawlTGDD() {
  console.log("Bắt đầu crawl:", new Date().toLocaleString());

  const categories = await crawlCategories();
  const categoryProducts = await crawlProducts(categories);
  const homeProducts = await crawlHomeProducts();

  const allProductsMap = new Map();
  [...homeProducts, ...categoryProducts].forEach((p) => {
    allProductsMap.set(p.id, p);
  });

  const allProducts = Array.from(allProductsMap.values());

  fs.writeFileSync(
    "db.json",
    JSON.stringify({ categories, products: allProducts }, null, 2),
    "utf-8"
  );

  console.log(`Đã cập nhật db.json với ${allProducts.length} sản phẩm`);
}

crawlTGDD();

cron.schedule("0 */3 * * *", () => {
  crawlTGDD();
});
