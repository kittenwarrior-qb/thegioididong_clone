import { useState, useEffect } from "react";
import { CartService } from "../services/cart.service";

const CartPage = () => {
  const [cart, setCart] = useState(CartService.getCart());

  useEffect(() => {
    setCart(CartService.getCart());
  }, []);

  const handleRemove = (id: number) => {
    const updated = CartService.removeFromCart(id);
    setCart(updated);
  };

  const handleQuantityChange = (id: number, quantity: number) => {
    if (quantity <= 0) return;
    const updated = CartService.updateQuantity(id, quantity);
    setCart(updated);
  };

  if (cart.length === 0) {
    return <div className="p-6 text-center text-gray-600">Giỏ hàng trống</div>;
  }

  return (
    <div className="cart-body max-w-[600px] mx-auto bg-white rounded p-4  mt-10">
      <div className="space-y-4">
        {cart.map((item) => (
          <div>
            <div
              key={item.id}
              className="product-item flex items-center gap-4 rounded-lg p-4"
            >
              <div className="">
                <img
                  src={item.img}
                  alt={item.name || "product"}
                  className="w-[80px] h-[80px] object-contain"
                />
              </div>

              <div className="w-full">
                <div className="flex justify-between">
                  <p className="text-[14px] text-[#dd2f2c]">{item.name}</p>
                  <div>
                    <p className="text-[14px]">
                      {Number(item.price).toLocaleString("vi-VN")}đ
                    </p>
                    {item.priceOld && (
                      <p className="line-through text-[#8894a7] text-[13px]">
                        {item.priceOld}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-5">
              <button
                onClick={() => handleRemove(item.id)}
                className="text-[12px] text-[#6e6e6e]"
              >
                Xóa
              </button>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center border border-gray-200 rounded">
                <button
                  onClick={() =>
                    handleQuantityChange(item.id, item.quantity - 1)
                  }
                  className="px-2 text-gray-600 hover:text-black"
                >
                  -
                </button>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(item.id, Number(e.target.value))
                  }
                  className="w-12 text-center border-none outline-none"
                />
                <button
                  onClick={() =>
                    handleQuantityChange(item.id, item.quantity + 1)
                  }
                  className="px-2 text-gray-600 hover:text-black"
                >
                  +
                </button>
              </div>
            </div>

            </div>
          </div>
        ))}
      </div>

      <div className="flex mt-6  pt-4 justify-between">
        <p  className="text-[14px]">
          Tạm tính ({CartService.getTotalQuantity()} sản phẩm):{" "}
        </p>
        <p  className="text-[14px]">
            {CartService.getTotalPrice().toLocaleString("vi-VN")}đ
        </p>
      </div>

      <div className="mt-6 flex">
        <button className="bg-[#FC7600] w-full text-white px-6 py-2 rounded-lg font-medium">
          Đặt hàng
        </button>
      </div>
    </div>
  );
};

export default CartPage;
