const Search = () => {
  const tags = [
    "iPhone 16", "Samsung S24", "Oppo Reno11", "Xiaomi 14", "MacBook Air", 
    "MacBook Pro", "Laptop Gaming", "Dell XPS", "Asus ROG", "HP Pavilion",
    "AirPods Pro", "Sony WH-1000XM5", "Loa Bluetooth", "iPad Pro", "iPad Air",
    "Apple Watch", "Samsung Watch", "Máy ảnh Canon", "Máy ảnh Sony", "GoPro Hero",
    "Máy in Canon", "Máy in HP", "Ổ cứng SSD", "Ổ cứng HDD", "USB 64GB",
    "Chuột Logitech", "Bàn phím cơ", "Tai nghe Gaming", "Ghế công thái học", "Màn hình 4K",
    "iPhone 16", "Samsung S24", "Oppo Reno11", "Xiaomi 14", "MacBook Air", 
    "MacBook Pro", "Laptop Gaming",
    "Dell XPS", "Asus ROG", "HP Pavilion",
    "AirPods Pro", "Sony WH-1000XM5", "Loa Bluetooth", "iPad Pro", "iPad Air"
  ];

  return (
    <div className="max-w-[1200px] mx-auto my-6 bg-white p-4 rounded-lg">
      <p className="text-[24px] font-bold mb-4">Mọi người cũng tìm kiếm</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            className="px-3 py-1 text-sm bg-gray-100 rounded-full cursor-pointer "
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Search;
