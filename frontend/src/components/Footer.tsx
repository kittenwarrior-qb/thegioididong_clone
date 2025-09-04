const Footer = () => {
    return (
        <div className="bg-white mt-8">
            <div className="max-w-[1200px] mx-auto py-6 text-sm text-gray-700 p-4 lg:p-0">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                        <h3 className="font-bold mb-2">Tổng đài hỗ trợ</h3>
                        <p>
                            Gọi mua: <span className="text-blue-600 font-semibold">1900 232 460</span>{" "}
                            (8:00 - 21:30)
                        </p>
                        <p>
                            Khiếu nại: <span className="text-blue-600 font-semibold">1800.1062</span>{" "}
                            (8:00 - 21:30)
                        </p>
                        <p>
                            Bảo hành: <span className="text-blue-600 font-semibold">1900 232 464</span>{" "}
                            (8:00 - 21:30)
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold mb-2">Về công ty</h3>
                        <ul className="space-y-1">
                            <li>Giới thiệu công ty (MWG.vn)</li>
                            <li>Tuyển dụng</li>
                            <li>Gửi góp ý, khiếu nại</li>
                            <li>Tìm siêu thị (2.965 shop)</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold mb-2">Thông tin khác</h3>
                        <ul className="space-y-1">
                            <li>Tích điểm Quà tặng VIP</li>
                            <li>Lịch sử mua hàng</li>
                            <li>Đăng ký bán hàng CTV chiết khấu cao</li>
                            <li>Tìm hiểu về mua trả chậm</li>
                            <li>Chính sách bảo hành</li>
                            <li>Xem thêm</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold mb-3">Website cùng tập đoàn</h3>
                        <div className="flex flex-wrap gap-3">
                            {Array(8)
                                .fill(0)
                                .map((_, i) => (
                                    <img
                                        key={i}
                                        src="https://placehold.co/100x40"
                                        alt={`logo-${i}`}
                                        className="h-10 object-contain rounded"
                                    />
                                ))}
                        </div>
                    </div>
                </div>

            </div>
            <div className="bg-[#f1f1f1]  p-4 lg:p-0">

                <div className="max-w-[1200px] mx-auto text-xs text-gray-500 mt-6 pt-4">
                    © 2018. Công ty cổ phần Thế Giới Di Động. GPĐKKD: 0303217354 do sở KH & ĐT TP.HCM
                    cấp ngày 02/01/2007. GPMXH: 21/GP-BTTTT do Bộ Thông Tin và Truyền Thông cấp ngày
                    11/01/2021. <br />
                    Địa chỉ: 128 Trần Quang Khải, P.Tân Định, Q.1, TP.HCM. Điện thoại: 028 38125960.
                    Email: hotrotmdt@thegioididong.com. Chịu trách nhiệm nội dung: Huỳnh Văn Tốt.
                    <br />
                    Xem chính sách sử dụng
                </div>
            </div>

        </div>
    );
};

export default Footer;
