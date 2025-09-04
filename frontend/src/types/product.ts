
export interface Product {
  id: number;
  name: string | null;
  price: string;
  priceOld: string | null;
  percent: string | null;
  brand: string;
  category: string;
  img: string;
  rating: string | null;
  sold: string | null;
  isFlashSale: boolean;
  tags: string[];
  isNew: boolean;
  isLoan: boolean;
  isOnline: boolean;
  isUpComming: boolean;
  flashSaleCount: string | null;
}

