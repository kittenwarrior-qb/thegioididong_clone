import type { Product } from "../types/product";

export interface CartItem extends Product {
  quantity: number;
}

export const CartService = {
  getCart: (): CartItem[] => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  },

  saveCart: (cart: CartItem[]) => {
    localStorage.setItem("cart", JSON.stringify(cart));
  },

  addToCart: (product: Product, quantity = 1) => {
    const cart = CartService.getCart();
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }

    CartService.saveCart(cart);
    return cart;
  },

  updateQuantity: (id: number, quantity: number) => {
    const cart = CartService.getCart().map((item) =>
      item.id === id ? { ...item, quantity } : item
    );
    CartService.saveCart(cart);
    return cart;
  },

  removeFromCart: (id: number) => {
    const cart = CartService.getCart().filter((item) => item.id !== id);
    CartService.saveCart(cart);
    return cart;
  },

  clearCart: () => {
    CartService.saveCart([]);
    return [];
  },

  getTotalQuantity: () => {
    return CartService.getCart().reduce((sum, item) => sum + item.quantity, 0);
  },

  getTotalPrice: () => {
    return CartService.getCart().reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    );
  },
};
