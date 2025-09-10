import { useState, useEffect } from "react";
import { Tabs } from "antd";
import { ApiService } from "../services/api";
import { type Product } from "../types/product";
import ProductCard from "./ProductCard";
import FlashSaleBanner from "../assets/tgdd/Screenshot 2025-09-10 104147.png";

interface ListCardProps {
  title: string;
  tab?: boolean;
  tabKey?: string;
  img?: string;
}

const TAB_CATEGORIES = [
  {
    key: "flashsale",
    name: "FlashSale",
    img: "https://cdnv2.tgdd.vn/mwg-static/common/Campaign/53/d3/53d33414879decc07afd80aedbb6a8e1.png",
    banner: FlashSaleBanner,
  },
  {
    key: "Laptop",
    name: "Laptop",
    img: "https://cdnv2.tgdd.vn/mwg-static/common/Campaign/7a/e0/7ae0723d3d978fd4c8a2c77f3bf4bd3a.png",
    banner:
      "https://cdnv2.tgdd.vn/mwg-static/common/Campaign/58/36/5836998ed7813e01f563ed338b3842ed.png",
  },
  {
    key: "Điện thoại",
    name: "Điện thoại",
    banner:
      "https://cdnv2.tgdd.vn/mwg-static/common/Campaign/c8/b7/c8b756baf5f990d065abf3acd1de19f6.png",
  },
  {
    key: "apple",
    name: "Apple",
    banner:
      "https://cdnv2.tgdd.vn/mwg-static/common/Campaign/5e/79/5e79ee941f32f645f8cb6c3a3147c45b.png",
  },
  {
    key: "AirTag, Vỏ bảo vệ AirTag",
    name: "Laptop",
    banner:
      "https://cdnv2.tgdd.vn/mwg-static/common/Campaign/9d/bd/9dbd33690ceee67cf301f0591c8de17c.png",
  },
  {
    key: "Phụ kiện tablet",
    name: "Phụ kiện",
    banner:
      "https://cdnv2.tgdd.vn/mwg-static/common/Campaign/58/36/5836998ed7813e01f563ed338b3842ed.png",
  },
  {
    key: "Đồng hồ thông minh",
    name: "Đồng hồ",
    banner:
      "https://cdnv2.tgdd.vn/mwg-static/common/Campaign/5b/3a/5b3ab025173bb4b0b90dbd6fd5bbd400.png",
  },
  {
    key: "Máy in",
    name: "PC, Máy in",
    banner:
      "https://cdnv2.tgdd.vn/mwg-static/common/Campaign/5e/79/5e79ee941f32f645f8cb6c3a3147c45b.png",
  },
];

const ListCard = ({ title, tab = true, tabKey, img }: ListCardProps) => {
  const [activeKey, setActiveKey] = useState(tabKey || "flashsale");
  const [products, setProducts] = useState<Record<string, Product[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const fetchProducts = async (key: string) => {
    if (products[key]) return;

    setLoading((prev) => ({ ...prev, [key]: true }));
    try {
      const prods = await ApiService.getProducts(key);
      setProducts((prev) => ({ ...prev, [key]: prods }));
    } catch (error) {
      console.error(error);
      setProducts((prev) => ({ ...prev, [key]: [] }));
    } finally {
      setLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  useEffect(() => {
    if (tab) {
      fetchProducts(activeKey);
    } else if (tabKey) {
      fetchProducts(tabKey);
    }
  }, [activeKey, tab, tabKey]);

  const renderProducts = (list: Product[] = [], banner?: string) => {
    return (
      <div className="space-y-4">
        {banner && (
          <img
            src={banner}
            className="w-full rounded-lg object-cover p-4 !py-0"
            alt="banner"
          />
        )}

        {img ? (
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-2 flex items-center justify-center">
              <img
                src={img}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            <div className="md:col-span-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {list.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {list.slice(0, 12).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const items = TAB_CATEGORIES.map((tab) => ({
    key: tab.key,
    label: tab.img ? (
      <img src={tab.img} className="h-full w-auto object-contain" />
    ) : (
      tab.name
    ),
    children: loading[tab.key] ? (
      <div className="flex justify-center py-10">loading...</div>
    ) : (
      renderProducts(products[tab.key], tab.banner)
    ),
  }));

  return (
    <div className="max-w-[1200px] mx-auto mt-10 mb-6">
      <h2 className="text-[24px] font-bold mb-4">{title}</h2>
      <div className="bg-white rounded-2xl">
        {tab ? (
          <Tabs
            activeKey={activeKey}
            items={items}
            onChange={(key) => setActiveKey(key)}
            className="custom-tabs"
          />
        ) : loading[tabKey || ""] ? (
          <div className="flex justify-center py-10">loading...</div>
        ) : (
          renderProducts(products[tabKey || ""])
        )}
        {img ? (
          <></>
        ) : (
          <div className="text-center my-3 font-semibold text-blue-500 cursor-pointer">
            Xem thêm sản phẩm
          </div>
        )}
      </div>
    </div>
  );
};

export default ListCard;
