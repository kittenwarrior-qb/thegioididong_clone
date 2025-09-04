import { useEffect, useState } from "react";
import { Dropdown } from "antd";
import TopBanner from "../assets/tgdd/topbanner.png";
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

const categories = [
  { id: 1, name: "Điện thoại", icon: Phone_Icon, angle: true, children: ["iPhone", "Samsung", "Xiaomi", "OPPO"] },
  { id: 2, name: "Laptop", icon: Laptop_Icon, children: ["Macbook", "Asus", "Lenovo", "HP"] },
  { id: 3, name: "Phụ kiện", icon: Asset_Icon, children: ["Tai nghe", "Sạc dự phòng", "Ốp lưng", "Cáp sạc"] },
  { id: 4, name: "Smartwatch", icon: SmartWatch_Icon, angle: true, children: ["Apple Watch", "Samsung Watch", "Huawei Watch"] },
  { id: 5, name: "Đồng hồ", icon: Watch_Icon },
  { id: 6, name: "Tablet", icon: Tablet_Icon, children: ["iPad", "Samsung Tab", "Xiaomi Pad"] },
  { id: 7, name: "Máy cũ, Thu cũ", icon: Old_Icon },
  { id: 8, name: "Màn hình", icon: PC_Icon, angle: true, children: ["Màn hình LG", "Màn hình Dell", "Máy in Canon", "Máy in HP"] },
  { id: 9, name: "Sim", icon: Sim_Icon },
  { id: 10, name: "Dịch vụ", icon: Service_Icon },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="sticky top-0 z-50">
      <div
        className={`bg-[#143130] h-[44px] overflow-hidden transition-all duration-300`}
        style={{
          opacity: isScrolled ? 0 : 1,
          height: isScrolled ? "0px" : "44px",
        }}
      >
        <img
          src={TopBanner}
          className="w-full max-w-[1200px] mx-auto h-[44px] object-cover"
        />
      </div>

      <div className="bg-[#ffd500]">
        <div className="sticky top-0 z-50 bg-[#ffd500] py-2">
          <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-3 p-2 md:p-0">
            <img
              src={LogoImg}
              width={228}
              height={40}
              className="flex-shrink-0"
            />

            <div className="flex items-center bg-white rounded-full px-3 w-full md:max-w-[400px] h-[40px] ">
              <img src={SearchIcon} width={17} height={17} />
              <input
                type="text"
                placeholder="iphone 16 series"
                className="outline-none h-full bg-transparent flex-1 px-3 placeholder:text-[12px] text-[12p]"
              />
            </div>

            <div className="flex items-center gap-3 md:gap-6 w-full ">
              <div className="flex items-center gap-1 cursor-pointer hover:opacity-80 hover:bg-[#ffe565] py-3 px-1 rounded-full">
                <img src={UserIcon} width={24} height={24} />
                <p className="text-[14px] hidden md:block ">Đăng nhập</p>
              </div>
              <div className="flex items-center gap-1 cursor-pointer hover:opacity-80 hover:bg-[#ffe565] py-3 px-1 rounded-full">
                <img src={CartIcon} width={24} height={24} />
                <p className="text-[14px] hidden md:block">Giỏ hàng</p>
              </div>
              <Location />
            </div>
          </div>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300`}
          style={{
            opacity: isScrolled ? 0 : 1,
            height: isScrolled ? "0px" : "44px", 
          }}
        >
          <div className=" px-2 max-w-[1200px] md:mx-auto">
            <div className="flex gap-4 md:gap-6 justify-between overflow-x-auto">
              {categories.map((cat) => {
                const menuItems =
                  cat.children?.map((child) => ({
                    key: child,
                    label: <span className="text-sm">{child}</span>,
                  })) || [];

                return (
                  <Dropdown
                    key={cat.id}
                    menu={{ items: menuItems }}
                    placement="bottom"
                    trigger={["hover"]}
                    arrow
                    disabled={!cat.children}
                  >
                    <div className="flex items-center cursor-pointer hover:bg-[#ffe565] gap-1 rounded-t-lg px-1 py-3">
                      <div className="flex items-center gap-1">
                        <img src={cat.icon} width={24} height={24} />
                        {cat.angle && (
                          <img
                            src={Angle_Icon}
                            width={16}
                            height={16}
                            className="rotate-270"
                          />
                        )}
                      </div>
                      <span className="text-[14px] text-center">{cat.name}</span>
                    </div>
                  </Dropdown>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
