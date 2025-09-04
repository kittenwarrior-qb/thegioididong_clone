import { useState, useCallback } from "react";
import { Modal, Select, AutoComplete } from "antd";
import debounce from "lodash.debounce";
import { ApiService, parseAddressComponents } from "../services/api";
import LocationIcon from "../assets/tgdd/location_icon.png";

const Location = () => {
  const [open, setOpen] = useState(false);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedWard, setSelectedWard] = useState<string | null>(null);

  const [options, setOptions] = useState<
    { value: string; lat: string; lon: string }[]
  >([]);
  const [searchValue, setSearchValue] = useState("");
  const [detail, setDetail] = useState<any>(null);

  const fetchAddress = async (keyword: string) => {
    if (!keyword) {
      setOptions([]);
      return;
    }
    try {
      const data = await ApiService.searchAddress(keyword);
      setOptions(
        data.map((d: any) => ({
          value: d.full,
          lat: d.lat,
          lon: d.lon,
        }))
      );
    } catch (e) {
      console.error("Search failed:", e);
    }
  };

  const debounceFetcher = useCallback(debounce(fetchAddress, 500), []);

  const fetchProvinces = async () => {
    const data = await ApiService.getProvinces();
    setProvinces(data);
  };

  const handleProvinceChange = async (value: string) => {
    setSelectedProvince(value);
    setSelectedWard(null);

    const data = await ApiService.getWardsByProvince(value);
    setWards(data);

    const p = provinces.find((pp) => String(pp.code) === String(value));
    if (p) setSearchValue(p.name);
    setDetail(null);
  };
  const handleSelectAddress = async (value: string, option: any) => {
    setSearchValue(value);
    if (option.lat && option.lon) {
      const detailData = await ApiService.getPlaceByLatLon(
        option.lat,
        option.lon
      );
      if (detailData) {
        setDetail({
          formatted: detailData.display_name,
          components: parseAddressComponents(detailData.address),
        });
      }
    }
    setSelectedProvince(null);
    setSelectedWard(null);
    setWards([]);
  };

  const displayText = (searchValue || "Chọn địa điểm").trim();

  return (
    <>
      <div
        onClick={() => {
          fetchProvinces();
          setOpen(true);
        }}
        className="cursor-pointer flex items-center gap-2 text-sm bg-[#ffe14c] p-3 w-full md:max-w-[300px] rounded-full hover:bg-[#fff0a2]"
      >
        <img src={LocationIcon} alt="location" width={20} height={20} />
        <span className="truncate max-w-[150px]">{displayText}</span>
      </div>

      <Modal
        title="Chọn địa chỉ nhận hàng"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => setOpen(false)}
        okText="Xác nhận"
        cancelText="Hủy"
        centered
        width={700}
      >
        <div className="space-y-4">
          <div className="p-3 rounded-md bg-gray-100">
            <p className="text-sm text-gray-500">Địa chỉ đang chọn:</p>
            <p className="font-semibold text-gray-800">
              {detail?.formatted ||
                searchValue ||
                (selectedWard && selectedProvince
                  ? `${wards.find((w) => w.code === selectedWard)?.name}, ${
                      provinces.find((p) => p.code === selectedProvince)?.name
                    }`
                  : selectedProvince
                  ? provinces.find((p) => p.code === selectedProvince)?.name
                  : "Chưa chọn")}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium mb-1">Nhập địa chỉ cụ thể</p>
            <AutoComplete
              style={{ width: "100%" }}
              options={options.map((o) => ({
                label: o.value,
                value: o.value,
                lat: o.lat,
                lon: o.lon,
              }))}
              value={searchValue}
              onSearch={(val) => {
                setSearchValue(val);
                debounceFetcher(val);
              }}
              onSelect={(_, option: any) =>
                handleSelectAddress(option.value, option)
              }
              placeholder="Ví dụ: Số 10 Nguyễn Trãi, Thanh Xuân, Hà Nội"
            />
          </div>

          <div className="flex items-center justify-center text-gray-400 text-xs">
            <span className="border-t border-gray-300 flex-grow"></span>
            <span className="px-2">Hoặc</span>
            <span className="border-t border-gray-300 flex-grow"></span>
          </div>

          <div className="flex gap-3">
            <Select
              className="w-full"
              placeholder="Chọn tỉnh/thành"
              value={selectedProvince || undefined}
              onChange={handleProvinceChange}
            >
              {provinces.map((p) => (
                <Select.Option key={p.code} value={p.code}>
                  {p.name}
                </Select.Option>
              ))}
            </Select>

            <Select
              className="w-full"
              placeholder="Chọn phường/xã"
              value={selectedWard || undefined}
              onChange={(value) => {
                setSelectedWard(value);
                const w = wards.find((ww) => String(ww.code) === String(value));
                const p = provinces.find(
                  (pp) => String(pp.code) === String(selectedProvince)
                );
                if (w && p) setSearchValue(`${w.name}, ${p.name}`);
                else if (w) setSearchValue(w.name);
                setDetail(null);
              }}
              disabled={!wards.length}
            >
              {wards.map((w) => (
                <Select.Option key={w.code} value={w.code}>
                  {w.name}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Location;
