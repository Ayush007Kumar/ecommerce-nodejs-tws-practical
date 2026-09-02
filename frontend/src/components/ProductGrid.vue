<script>
import { useCartStore } from "@/stores/cart";

export default {
  props: {
    products: {
      type: Array,
      default: () => [],
    },
  },

  setup() {
    const cartStore = useCartStore();
    return { cartStore };
  },

  methods: {
    trimText(text = "", n = 20) {
      return text.substring(0, n) + "...";
    },
  },
};
</script>

<template>
  <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
    <div
      v-for="(product, key) in this.products"
      :key="key"
      class="product-card group"
    >
      <figure class="relative h-56 overflow-hidden bg-slate-100">
        <img class="product-image h-full w-full object-cover transition duration-500 group-hover:scale-105" :src="product.images[0]" :alt="product.name" loading="lazy" />
        <span class="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-bold text-indigo-700 shadow-sm">TOP PICK</span>
        <button aria-label="Save item" class="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg text-slate-500 shadow-sm hover:text-rose-500">♡</button>
      </figure>
      <div class="p-4">
        <p class="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Northstar Market</p>
        <h2 class="min-h-14 text-lg font-bold text-slate-800">{{ product.name }}</h2>
        <p class="mt-2 min-h-12 text-sm leading-5 text-slate-500">
          {{ trimText(product.description, 85) }}
        </p>
        <div class="mt-4 flex items-center justify-between">
          <div><span class="text-xl font-black text-slate-900">${{ product.price }}</span><span class="ml-2 text-xs text-slate-400 line-through">${{ (Number(product.price) * 1.18).toFixed(2) }}</span></div>
          <span class="rounded bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">★ 4.8</span>
        </div>
        <p class="mt-3 text-xs font-bold text-emerald-600">FREE delivery available</p>
        <div class="mt-4 flex gap-2">
          <router-link :to="'/product/' + product._id" class="flex-1 rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-bold text-white hover:bg-indigo-700"
            >View item</router-link
          >
          <button aria-label="Add item to cart" @click="cartStore.addItem(product)" class="rounded-md border border-slate-200 px-3 py-2 text-lg text-indigo-600 hover:bg-indigo-50">+</button>
        </div>
      </div>
    </div>
  </div>
</template>
