<script>
import { useCartStore } from "@/stores/cart";

export default {
  setup() {
    const cartStore = useCartStore();
    return { cartStore };
  },
  methods: {
    formatPrice(value) {
      return Number(value).toFixed(2);
    },
  },
};
</script>

<template>
  <main class="market-container py-10">
    <div class="mb-8">
      <p class="text-sm font-bold uppercase tracking-wider text-indigo-600">Your selection</p>
      <h1 class="mt-1 text-4xl font-black text-slate-900">Shopping cart</h1>
    </div>
    <div v-if="!cartStore.items.length" class="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
      <p class="text-xl font-bold text-slate-700">Your cart is empty</p>
      <p class="mt-2 text-slate-500">Add something beautiful from the collection.</p>
      <router-link to="/" class="mt-6 inline-block rounded-md bg-indigo-600 px-5 py-3 font-bold text-white">Continue shopping</router-link>
    </div>
    <div v-else class="grid gap-8 lg:grid-cols-[1fr_340px]">
    <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table class="w-full text-left">
        <thead>
          <tr class="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400">
            <th class="p-4">Item</th>
            <th class="p-4">Quantity</th>
            <th class="p-4">Price</th>
            <th class="p-4">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cartStore.items" :key="item.id" class="border-b border-slate-100">
            <td class="flex items-center gap-3 p-4"><img :src="item.image" :alt="item.name" class="h-16 w-16 rounded-md object-cover" /><span class="font-bold text-slate-700">{{ item.name }}</span></td>
            <td class="p-4"><input type="number" min="1" :value="item.quantity" @change="cartStore.updateQuantity(item.id, $event.target.value)" class="w-20 rounded-md border border-slate-200 px-3 py-2" /></td>
            <td class="p-4 font-bold text-slate-900">${{ formatPrice(Number(item.price) * item.quantity) }}</td>
            <td class="p-4"><button @click="cartStore.removeItem(item.id)" class="text-sm font-bold text-red-500 hover:text-red-700">Remove</button></td>
          </tr>
        </tbody>
      </table>
    </div>
    <aside class="h-fit rounded-xl bg-slate-900 p-6 text-white shadow-lg">
      <h2 class="text-xl font-black">Order summary</h2>
      <div class="mt-6 flex justify-between text-slate-300"><span>Items</span><span>{{ cartStore.itemCount }}</span></div>
      <div class="mt-3 flex justify-between text-slate-300"><span>Delivery</span><span class="text-cyan-300">FREE</span></div>
      <div class="my-6 border-t border-slate-700"></div>
      <div class="flex justify-between text-xl font-black"><span>Total</span><span>${{ formatPrice(cartStore.subtotal) }}</span></div>
      <router-link to="/checkout" class="mt-6 block rounded-md bg-cyan-400 px-4 py-3 text-center font-black text-slate-950 hover:bg-cyan-300">Proceed to checkout</router-link>
    </aside>
    </div>
  </main>
</template>
