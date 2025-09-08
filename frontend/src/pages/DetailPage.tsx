import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ApiService } from "../services/api";
import type { Product } from "../types/product";
import { Breadcrumb, Rate } from "antd";
import { CartService } from "../services/cart.service";

const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      ApiService.getProductById(Number(id))
        .then((found) => setProduct(found))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="p-6 text-center">Đang tải...</div>;
  if (!product) return <div className="p-6 text-center">Không tìm thấy sản phẩm</div>;

  const handleAddToCart = () => {
    if (!product) return;
    CartService.addToCart(product, 1);
    alert("Đã thêm vào giỏ hàng!");
  };

  const handleBuyNow = () => {
    if (!product) return;
    CartService.addToCart(product, 1);
    navigate("/cart");
  };

  return (
    <div className="max-w-[1200px] mx-auto pt-5">
      <Breadcrumb
        separator=">"
        items={[
          { title: product.brand },
          { title: product.name },
        ]}
      />

      <div className="flex flex-col md:flex-row gap-6 mt-3">
        <div className="w-full md:w-1/2">
          <div className="rounded-lg overflow-hidden">
            <img
              src={product.img}
              alt={product.name || "product"}
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <h1 className="text-2xl font-semibold">{product.name}</h1>

          {product.rating && (
            <div className="flex items-center gap-2">
              <Rate disabled defaultValue={Number(product.rating) || 0} />
            </div>
          )}

          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-red-600">
              {Number(product.price).toLocaleString("vi-VN")}đ
            </span>
            {product.priceOld && (
              <span className="line-through text-gray-500">
                {product.priceOld}
              </span>
            )}
            {product.percent && (
              <span className="text-green-600 font-medium">{product.percent}</span>
            )}
          </div>

          <p className="text-gray-700">
            <strong>Hãng:</strong> {product.brand}
          </p>
          <p className="text-gray-700">
            <strong>Danh mục:</strong> {product.category}
          </p>

          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-3 mt-4">
            <button
              onClick={handleAddToCart}
              className="px-6 py-3 border border-gray-400 rounded-lg hover:bg-gray-100"
            >
              Thêm vào giỏ
            </button>
            <button
              onClick={handleBuyNow}
              className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700"
            >
              Mua ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
