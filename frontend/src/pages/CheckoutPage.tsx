import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import QRCode from "qrcode";
import { QRPay, BanksObject } from "vietnam-qr-pay";
import { CartService } from "../services/cart.service";
import type { CartItem } from "../services/cart.service";

type LocationState = {
  products?: CartItem[];
  total?: number;
};

const CheckoutPage = () => {
  const location = useLocation();
  const state = location.state as LocationState || {};
  const products: CartItem[] = state.products || CartService.getCart() || [];
  const total = state.total ?? CartService.getTotalPrice();
  const [amount] = useState<number>(total);
  const [qrContent, setQrContent] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const qrPay = QRPay.initVietQR({
      bankBin: BanksObject.vietcombank.bin,
      bankNumber: "1041852389",
      amount: amount.toString(),
      purpose: "Thanh toán giỏ hàng",
    });

    setQrContent(qrPay.build());
  }, [amount]);

  useEffect(() => {
    if (qrContent && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, qrContent, { width: 200 }, (error) => {
        if (error) console.error(error);
      });
    }
  }, [qrContent]);

  if (!products.length) {
    return <div className="p-6 text-center text-gray-600">Không có sản phẩm để thanh toán.</div>;
  }

  return (
    <div className="max-w-[600px] mx-auto p-6 bg-white rounded-lg mt-10 shadow-md">
      <h2 className="text-xl font-bold mb-6  pb-2">Thanh toán VietQR / VNPayQR</h2>

      <div className="space-y-4 mb-6">
        {products.map((item) => (
          <div key={item.id} className="flex justify-between items-center p-2  rounded-lg">
            <div className="flex items-center gap-4">
              <img
                src={item.img}
                className="w-[80px] h-[80px] object-contain"
              />
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-gray-500">Số lượng: {item.quantity}</p>
                {item.priceOld && (
                  <p className="text-xs text-gray-400 line-through">
                    {item.priceOld}
                  </p>
                )}
              </div>
            </div>
            <p className="text-sm text-[#dd2f2c]">
              {(Number(item.price) * Number(item.quantity)).toLocaleString("vi-VN")}đ
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-between  pt-3 mb-6 text-base font-semibold">
        <p>Tạm tính ({products.reduce((sum, p) => sum + p.quantity, 0)} sản phẩm):</p>
        <p className="text-[#dd2f2c]">{amount.toLocaleString("vi-VN")}đ</p>
      </div>

      <div className="text-center">
        <h3 className="font-semibold mb-2">Quét QR để thanh toán</h3>
        <canvas ref={canvasRef} className="mx-auto mb-2"></canvas>
        <p className="text-xs text-gray-500 break-all">{qrContent}</p>
      </div>
    </div>
  );
};

export default CheckoutPage;
