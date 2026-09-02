import { defineStore } from "pinia";

const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: Array.isArray(savedCart) ? savedCart : [],
  }),
  getters: {
    itemCount: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    subtotal: (state) => state.items.reduce((total, item) => total + Number(item.price) * item.quantity, 0),
  },
  actions: {
    persist() {
      localStorage.setItem("cart", JSON.stringify(this.items));
    },
    addItem(product, quantity = 1) {
      const existingItem = this.items.find((item) => item.id === product._id);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        this.items.push({
          id: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || "",
          quantity,
        });
      }
      this.persist();
    },
    updateQuantity(id, quantity) {
      const item = this.items.find((cartItem) => cartItem.id === id);
      if (!item) return;
      item.quantity = Math.max(1, Number(quantity) || 1);
      this.persist();
    },
    removeItem(id) {
      this.items = this.items.filter((item) => item.id !== id);
      this.persist();
    },
  },
});
