import { type Product } from "../types/product";

const DATA_JSON = "/data/data.json"; 
const LOCATION_JSON = "/data/location.json";
const NOMINATIM_URL = "https://nominatim.openstreetmap.org";

const cleanProducts = (data: Product[]) =>
  data.filter((p) => p.name && p.name.trim() !== "");

export const ApiService = {
  getProducts: async (
    tabKey: string,
    limit = 35,
    page = 1
  ): Promise<Product[]> => {
    try {
      const res = await fetch(DATA_JSON);
      const data = await res.json();
      let products: Product[] = data.products || [];
      products = cleanProducts(products);

      if (tabKey === "apple") {
        products = products.filter((p) => p.brand === "Apple");
      } else if (tabKey === "flashsale") {
        products = products.filter((p) => p.isFlashSale);
      } else {
        products = products.filter((p) => p.category === tabKey);
      }

      if (tabKey !== "flashsale") {
        products = products.filter((p) => !p.flashSaleCount);
      }

      const start = (page - 1) * limit;
      const end = start + limit;
      return products.slice(start, end);
    } catch (error) {
      console.error(`Lỗi fetch products cho tab ${tabKey}:`, error);
      return [];
    }
  },

  getProductById: async (id: number): Promise<Product | null> => {
    try {
      const res = await fetch(DATA_JSON);
      const data = await res.json();
      const products: Product[] = cleanProducts(data.products || []);

      const found = products.find((p) => p.id === id);
      return found || null;
    } catch (error) {
      console.error(`Lỗi fetch product id=${id}:`, error);
      return null;
    }
  },

  getCategories: async () => {
    try {
      const res = await fetch(DATA_JSON);
      const data = await res.json();
      return data.categories || [];
    } catch (error) {
      console.error("Lỗi fetch categories:", error);
      return [];
    }
  },

  getProvinces: async () => {
    try {
      const res = await fetch(LOCATION_JSON);
      const data = await res.json();
      return data.provinces || [];
    } catch (error) {
      console.error("Lỗi fetch provinces:", error);
      return [];
    }
  },

  getWardsByProvince: async (provinceCode: number | string) => {
    try {
      const res = await fetch(LOCATION_JSON);
      const data = await res.json();
      const wards = data.wards || [];
      return wards.filter((w: any) => w.province_code == provinceCode);
    } catch (error) {
      console.error(`Lỗi fetch wards cho province ${provinceCode}:`, error);
      return [];
    }
  },

  searchAddress: async (keyword: string) => {
    try {
      const res = await fetch(
        `${NOMINATIM_URL}/search?q=${encodeURIComponent(
          keyword
        )}&format=json&addressdetails=1&limit=5&countrycodes=vn`
      );
      const data = await res.json();
      return data.map((item: any) => ({
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
      const res = await fetch(
        `${NOMINATIM_URL}/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1&accept-language=vi`
      );
      return await res.json();
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
