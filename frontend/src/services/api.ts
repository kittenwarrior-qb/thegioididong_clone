import axios from "axios";
import { type Product } from "../types/product";

const API_BASE = "http://localhost:3000"; 
const LOCATION_API = "http://localhost:5050"; 

const NOMINATIM_URL = "https://nominatim.openstreetmap.org";

const cleanProducts = (data: Product[]) =>
  data.filter((p) => p.name !== null && p.name.trim() !== "");

export const ApiService = {
  getProducts: async (
    tabKey: string,
    limit = 35,
    page = 1
  ): Promise<Product[]> => {
    try {
      let params: Record<string, any> = { _limit: limit, _page: page };

      if (tabKey === "apple") {
        params.brand = "Apple";
      } else if (tabKey === "flashsale") {
        params.isFlashSale = true;
      } else {
        params.category = tabKey;
      }

      const res = await axios.get<Product[]>(`${API_BASE}/products`, { params });

      let products = cleanProducts(res.data);

      if (tabKey !== "flashsale") {
        products = products.filter((p) => !p.flashSaleCount);
      }

      return products;
    } catch (error) {
      console.error(`Lỗi fetch products cho tab ${tabKey}:`, error);
      return [];
    }
  },
  getProvinces: async () => {
    try {
      const res = await axios.get(`${LOCATION_API}/provinces`);
      return res.data;
    } catch (error) {
      console.error("Lỗi fetch provinces:", error);
      return [];
    }
  },

  getWardsByProvince: async (provinceId: string | number) => {
    try {
      const res = await axios.get(`${LOCATION_API}/wards`, {
        params: { province_code: provinceId },
      });
      return res.data;
    } catch (error) {
      console.error(`Lỗi fetch wards cho province ${provinceId}:`, error);
      return [];
    }
  },

  searchAddress: async (keyword: string) => {
    try {
      const res = await axios.get(`${NOMINATIM_URL}/search`, {
        params: {
          q: keyword,
          format: "json",
          addressdetails: 1,
          limit: 5,
          countrycodes: "vn",
        },
      });
      return res.data.map((item: any) => ({
        full: item.display_name,
        lat: item.lat,
        lon: item.lon,
      }));
    } catch (error) {
      console.error("Lỗi searchAddress:", error);
      return [];
    }
  },

  getPlaceByLatLon: async (lat: string, lon: string) => {
    try {
      const res = await axios.get(`${NOMINATIM_URL}/reverse`, {
        params: {
          lat,
          lon,
          format: "json",
          addressdetails: 1,
          language: "vi",
        },
      });
      return res.data;
    } catch (error) {
      console.error("Lỗi getPlaceByLatLon:", error);
      return null;
    }
  },
};

export const parseAddressComponents = (components: any) => {
  if (!components) return {};

  return {
    street: components.road || "",
    ward: components.suburb || components.village || "",
    district: components.county || components.city_district || "",
    province: components.state || "",
    country: components.country || "",
  };
};
