import { useState, useEffect } from "react";
import AdBanner from "./adBanner";
import CarouselBanner from "./CarouselBanner";
import CarouselBlog from "./CarouselBlog";
import ChatBot from "./chatBot";
import Footer from "./Footer";
import Header from "./Header";
import ListCard from "./ListCard";
import Search from "./Search";

const Main = () => {
  const [listCards, setListCards] = useState([
    { title: "Khuyến mãi Online", tab: true },
    { title: "Gợi ý cho bạn", tab: false, tabKey: "Điện thoại" },
    {
      title: "Sản phẩm đặc quyền",
      tab: false,
      tabKey: "Điện thoại",
      img: "https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/85/b0/85b0e362b56d952013af81b6388d7e4a.png",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const fullHeight = document.body.scrollHeight;

    if (scrollTop + windowHeight + 100 >= fullHeight && !loading) {
      setLoading(true);
      setTimeout(() => {
        const newCard = {
          title: "Lab top mới nhất",
          tab: false,
          tabKey: "Laptop",
        };
        setListCards((prev) => [...prev, newCard]);
        setLoading(false);
      }, 1000);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  const footerCards = [
    { title: "Đồng hồ thông minh", tab: false, tabKey: "Đồng hồ thông minh" },
    { title: "Máy in", tab: false, tabKey: "Máy in" },
    { title: "Phụ kiện", tab: false, tabKey: "Phụ kiện tablet" },
    { title: "Đồng hồ", tab: false, tabKey: "Đồng hồ thông minh" },
  ];

  return (
    <div>
      <Header />
      <AdBanner />

      {listCards.map((card, idx) => (
        <ListCard key={idx} {...card} />
      ))}

      <CarouselBanner />

      <div className="mx-auto max-w-[1200px] my-8">
        <p className="text-[24px] font-bold mb-4">Tuần Lễ SAMSUNG</p>
        <img
          src="//cdnv2.tgdd.vn/mwg-static/tgdd/Banner/d8/f3/d8f31489b1bda72aba38ab7dd4f36a0b.png"
          className="w-full h-auto rounded-lg"
        />

        <p className="text-[24px] font-bold mb-4 mt-8">Gian hàng ưu đãi</p>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <img
            src="//cdnv2.tgdd.vn/mwg-static/tgdd/Banner/55/cf/55cfffcebc69f03756bf01e6d5d4bbe4.png"
            className="w-full h-auto rounded-lg"
          />
          <img
            src="//cdnv2.tgdd.vn/mwg-static/tgdd/Banner/71/5c/715c1b21b7ec332f57a86561094c42b4.png"
            className="w-full h-auto rounded-lg"
          />
          <img
            src="//cdnv2.tgdd.vn/mwg-static/tgdd/Banner/aa/dd/aadd9bb47d062ac4a033a631f92194c1.png"
            className="w-full h-auto rounded-lg"
          />
          <img
            src="//cdnv2.tgdd.vn/mwg-static/tgdd/Banner/5a/97/5a972af70b6d7befbc034351738c52c9.png"
            className="w-full h-auto rounded-lg"
          />
        </div>
      </div>

      <CarouselBlog />
      <Search />
      <ChatBot />
      <Footer />

      <div className="mx-auto max-w-[1200px] my-8">
        {footerCards.map((card, idx) => (
          <ListCard key={`footer-${idx}`} {...card} />
        ))}
      </div>

      {loading && (
        <div className="flex justify-center my-4">
          <span className="ml-2 text-yellow-500 font-semibold">Đang tải thêm sản phẩm...</span>
        </div>
      )}
    </div>
  );
};

export default Main;
