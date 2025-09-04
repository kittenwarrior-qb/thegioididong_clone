import { Carousel } from "antd";

interface BlogItem {
  id: number;
  title: string;
  img: string;
}

// Hàm chunk để chia mảng thành từng nhóm 4 phần tử
const chunkArray = (arr: BlogItem[], size: number) => {
  const result: BlogItem[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

const CarouselBlog = () => {
  const fakeBlogs: BlogItem[] = [
    { id: 1, title: "Những nâng cấp đáng tiền của Galaxy A17 5G nếu so với Galaxy A16 5G là gì?", img: "https://cdnv2.tgdd.vn/mwg-static/tgdd/News/Thumb/1581939/galaxy-a17-5g-26-T638914542921249029.jpg" },
    { id: 2, title: "Bảng giá thay camera iPhone chính hãng uy tín giá tốt mới nhất 2025", img: "https://cdnv2.tgdd.vn/mwg-static/common/Common/bang-gia-thay-camera-iphone-thumb1.jpg" },
    { id: 3, title: "Trên tay nhanh Google Pixel 10 series: Thiết kế cũ, cải tiến mạnh AI, đều dùng chip Tensor G5", img: "https://cdnv2.tgdd.vn/mwg-static/common/News/pixel-10-series-t638913814156700064.jpg" },
    { id: 4, title: "Bảng giá sửa chữa MacBook chính hãng Apple uy tín mới nhất 2025", img: "https://cdnv2.tgdd.vn/mwg-static/common/Common/bang-gia-sua-chua-macbook-thumb1.jpg" },
  ];

  const slides = chunkArray(fakeBlogs, 4);

  return (
    <div className="max-w-[1200px] mx-auto my-6 bg-white p-3 rounded-lg">
        <p className="text-[24px] font-bold mb-4">Mạng xã hội thegioididong.com</p>
      <Carousel autoplay dots draggable arrows>
        {slides.map((group, idx) => (
          <div key={idx}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {group.map((blog) => (
                <div
                  key={blog.id}
                  className="rounded-lg overflow-hidden shadow hover:shadow-lg transition"
                >
                  <img
                    src={blog.img}
                    alt={blog.title}
                    className="w-full h-[150px] object-cover"
                  />
                  <div className="p-2">
                    <h3 className="text-sm font-semibold line-clamp-2">
                      {blog.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Carousel>
        <p className="text-center my-3 font-semibold text-blue-500 cursor-pointer">
          Xem thêm sản phẩm
        </p>
    </div>
  );
};

export default CarouselBlog;
