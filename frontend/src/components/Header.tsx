import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import LogoImg from "../assets/tgdd/logo1.png";
import SearchIcon from "../assets/tgdd/search_icon.png";
import UserIcon from "../assets/tgdd/user_icon.png";
import CartIcon from "../assets/tgdd/cart_icon.png";

import Phone_Icon from "../assets/tgdd/imgi_2_phonne-24x24.png";
import Laptop_Icon from "../assets/tgdd/imgi_3_laptop-24x24.png";
import Asset_Icon from "../assets/tgdd/imgi_4_phu-kien-24x24.png";
import SmartWatch_Icon from "../assets/tgdd/imgi_6_smartwatch-24x24.png";
import Watch_Icon from "../assets/tgdd/imgi_7_watch-24x24.png";
import Tablet_Icon from "../assets/tgdd/imgi_8_tablet-24x24.png";
import Old_Icon from "../assets/tgdd/imgi_9_may-cu-24x24.png";
import PC_Icon from "../assets/tgdd/imgi_10_PC-24x24.png";
import Sim_Icon from "../assets/tgdd/imgi_11_sim-24x24.png";
import Service_Icon from "../assets/tgdd/imgi_14_tien-ich-24x24.png";
import Angle_Icon from "../assets/tgdd/imgi_68_icon_angle-left.png";

import Location from "./Location";
import { CartService } from "../services/cart.service";
import { getUser, logout } from "../services/auth.service";

const categories = [
  {
    id: 1,
    name: "Điện thoại",
    icon: Phone_Icon,
    children: ["iPhone", "Samsung", "Xiaomi", "OPPO"],
  },
  {
    id: 2,
    name: "Laptop",
    icon: Laptop_Icon,
    children: ["Macbook", "Asus", "Lenovo", "HP"],
  },
  {
    id: 3,
    name: "Phụ kiện",
    icon: Asset_Icon,
    children: ["Tai nghe", "Sạc dự phòng", "Ốp lưng", "Cáp sạc"],
    angle: true,
  },
  {
    id: 4,
    name: "Smartwatch",
    icon: SmartWatch_Icon,
    children: ["Apple Watch", "Samsung Watch", "Huawei Watch"],
  },
  { id: 5, name: "Đồng hồ", icon: Watch_Icon },
  {
    id: 6,
    name: "Tablet",
    icon: Tablet_Icon,
    children: ["iPad", "Samsung Tab", "Xiaomi Pad"],
  },
  { id: 7, name: "Máy cũ, Thu cũ", icon: Old_Icon, angle: true },
  {
    id: 8,
    name: "Màn hình, Máy in",
    icon: PC_Icon,
    angle: true,
    children: ["Màn hình LG", "Màn hình Dell", "Máy in Canon", "Máy in HP"],
  },
  { id: 9, name: "Sim, Thẻ cào", icon: Sim_Icon, angle: true },
  { id: 10, name: "Dịch vụ tiện ích", icon: Service_Icon, angle: true },
];

const MiddleBlock = ({
  cartQuantity,
  user,
  onLogout,
}: {
  cartQuantity: number;
  user: { username?: string } | null;
  onLogout: () => void;
}) => (
  <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center py-2">
    <Link to="/">
      <img src={LogoImg} width={228} height={40} alt="logo" />
    </Link>

    <div className="flex items-center bg-white rounded-full px-3 w-full md:max-w-[415px] h-[40px]">
      <img src={SearchIcon} width={17} height={17} alt="search" />
      <input
        type="text"
        placeholder="Laptop nhập học"
        className="outline-none h-full bg-transparent flex-1 px-3 text-[12px] placeholder:text-[12px] placeholder-orange-400"
      />
    </div>

    <div className="flex w-full items-center gap-2 ml-10">
      {user ? (
        <>
          <div className="flex items-center gap-1 cursor-pointer hover:bg-[#ffe565] py-2 px-2 rounded-full">
            <img src={UserIcon} width={24} height={24} alt="user" />
            <span className="text-[14px] hidden md:block">{user.username}</span>
          </div>
          <div className="flex items-center gap-1 cursor-pointer hover:bg-[#ffe565] py-2 px-2 rounded-full">
            <button
              onClick={onLogout}
              className="text-xs ml-2 underline hidden md:block"
            >
              Logout
            </button>
          </div>
        </>
      ) : (
        <Link
          to="/auth"
          className="flex items-center gap-1 cursor-pointer hover:bg-[#ffe565] py-2 px-2 rounded-full  min-w-[120px]"
        >
          <img src={UserIcon} width={24} height={24} alt="user" />
          <span className="text-[14px] hidden md:block ">Đăng nhập</span>
        </Link>
      )}

      <Link
        to="/cart"
        className="relative flex items-center gap-1 cursor-pointer hover:bg-[#ffe565] py-2 px-2 rounded-full  min-w-[120px]"
      >
        <img src={CartIcon} width={24} height={24} alt="cart" />
        <p className="text-[14px] hidden md:block">Giỏ hàng</p>

        {cartQuantity > 0 && (
          <span className="absolute top-[10px] left-[14px] bg-red-600 text-white text-[10px] w-3 h-3 flex items-center justify-center rounded-full">
            {cartQuantity}
          </span>
        )}
      </Link>

      <Location />
    </div>
  </div>
);

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(
    CartService.getTotalQuantity()
  );
  const [user, setUser] = useState<{ username?: string } | null>(getUser());

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 200);
    window.addEventListener("scroll", handleScroll);

    const handleStorage = () => {
      setCartQuantity(CartService.getTotalQuantity());
      setUser(getUser());
    };
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    window.location.href = "/auth";
  };

  return (
    <>
      <div
        className={`bg-[#ffd500] transition-all duration-300 ${
          isScrolled ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="bg-[#FFE800] h-[44px]">
          <img
            src="//cdnv2.tgdd.vn/mwg-static/tgdd/Banner/e9/dd/e9dd22f72466a1a606868c749e029330.png"
            className="w-full max-w-[1200px] mx-auto h-[44px] object-cover"
            alt="top-banner"
          />
        </div>

        <MiddleBlock
          cartQuantity={cartQuantity}
          user={user}
          onLogout={handleLogout}
        />

        <div className="px-2 max-w-[1240px] mx-auto flex justify-between items-center h-[44px]">
          {categories.map((cat) => (
            <div key={cat.id} className="relative group">
              <div className="flex items-center gap-1 cursor-pointer hover:bg-[#ffe565] px-3 py-2 rounded-t-lg whitespace-nowrap">
                <img src={cat.icon} width={20} height={20} alt={cat.name} />
                <span className="text-[14px]">{cat.name}</span>
                {cat.angle && (
                  <img
                    src={Angle_Icon}
                    width={8}
                    height={8}
                    className="rotate-270"
                    alt="angle"
                  />
                )}
              </div>
              {cat.children && (
                <div className="absolute top-full left-0 bg-white shadow-md rounded hidden group-hover:block z-50 min-w-[150px]">
                  {cat.children.map((child) => (
                    <Link
                      key={child}
                      to={`/${child.toLowerCase()}`}
                      className="block px-3 py-2 text-sm hover:bg-gray-100"
                    >
                      {child}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {isScrolled && (
        <div className="sticky top-0 bg-[#ffd500] z-50 shadow-md">
          <MiddleBlock
            cartQuantity={cartQuantity}
            user={user}
            onLogout={handleLogout}
          />
        </div>
      )}
    </>
  );
};

export default Header;
