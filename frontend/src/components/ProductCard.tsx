import { Card, Tag, Progress } from "antd";
import { type Product } from "../types/product";
import { StarFilled } from "@ant-design/icons";

interface ProductCardProps {
  product: Product;
}

const parseFlashSale = (str: string) => {
  const match = str.match(/(\d+)\s*\/\s*(\d+)/);
  if (match) {
    const remaining = parseInt(match[1], 10);
    const total = parseInt(match[2], 10);
    return { remaining, total };
  }
  return null;
};

const ProductCard = ({ product }: ProductCardProps) => {
  const showNewTag = product.isNew || product.isUpComming;

  const flashSaleData =
    typeof product.flashSaleCount === "string"
      ? parseFlashSale(product.flashSaleCount)
      : null;

  const flashSalePercent =
  flashSaleData && flashSaleData.total > 0
    ? Math.min(
        100,
        Math.round((flashSaleData.remaining / flashSaleData.total) * 100)
      )
    : null;

  return (
    <Card
      className="relative rounded-lg"
      cover={
        <div className="relative">
          <img
            alt={product.name || ""}
            src={
              product.img ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6wXPiBTvb6il38hh8Iilsswkc7P1pHx0m4g&s"
            }
            className="h-[180px] w-full object-contain p-2 hover:translate-y-[-5px] transition-transform duration-200"
          />

          <div className="absolute top-2 left-2 flex gap-2">
            {showNewTag && (
              <Tag color="red" className="m-0">
                Mẫu mới
              </Tag>
            )}
            {product.isLoan && (
              <Tag color="blue" className="m-0">
                Trả góp 0%
              </Tag>
            )}
          </div>
        </div>
      }
    >
      <Card.Meta
        title={<p className="line-clamp-2 font-medium">{product.name}</p>}
        description={
          <div className="space-y-1">
            <p className="font-bold text-[18px] text-[#dd2f2c]">
              {Number(product.price).toLocaleString("vi-VN")}đ
            </p>

            {product.priceOld && product.percent && (
              <div className="flex items-center gap-2">
                <p className="line-through text-gray-400 text-sm">
                  {product.priceOld}
                </p>
                <p className="text-[#dd2f2c]">({product.percent})</p>
              </div>
            )}

            {product.tags.includes("gift") && (
              <p className="text-sm text-gray-600">Quà 500.000đ</p>
            )}

            {product.rating && product.sold && (
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <StarFilled className="text-yellow-400" /> {product.rating}{" "}
                {product.sold}
              </p>
            )}
          </div>
        }
      />

      <div className="mt-2 flex flex-wrap gap-1">
        {product.isOnline && (
          <Tag color="purple" className="text-xs">
            Chỉ bán online
          </Tag>
        )}
        {product.tags.includes("exclusive") && (
          <Tag color="gold" className="text-xs">
            Độc quyền
          </Tag>
        )}
      </div>

      {flashSaleData && (
  <div className="mt-3 space-y-2">
    <div className="flex items-center gap-2 relative">
      <span className="text-xl absolute left-[-10px] top-[-2px] z-10">🔥</span>
      <div className="relative flex-1">
        <Progress
          percent={flashSalePercent ?? 0}
          strokeColor={{
            '0%': '#ffbe27', 
            '100%': '#dddddd', 
          }}
          showInfo={false}
          className="!h-[25px] [&_.ant-progress-bg]:!h-[25px] [&_.ant-progress-inner]:!rounded-md"
        />
        <span className="absolute top-[-10px] inset-0 flex items-center justify-center text-xs font-medium ">
          {`Còn ${flashSaleData.remaining}/${flashSaleData.total} suất`}
        </span>
      </div>
    </div>

    <div className="bg-[#f1f8fe] text-[#4794ec] w-full py-2 rounded-md cursor-pointer hover:bg-[#e4f3ff] transition">
      <p className="text-center font-medium">Mua ngay</p>
    </div>
  </div>
)}

    </Card>
  );
};

export default ProductCard;
