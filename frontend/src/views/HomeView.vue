<script>
import axios from "axios";
import ProductGrid from "@/components/ProductGrid.vue";

export default {
  components: { ProductGrid },

  data() {
    return {
      products: [],
      shops: [],
      categories: [],
      dataLoaded: false,
      loadError: "",
    };
  },

  async created() {
    try {
      const products = await axios({
        baseURL: import.meta.env.VITE_BACKENDURL,
        method: "get",
        url: "main/product/recent",
      });
      this.products = products.data;

      const shops = await axios({
        baseURL: import.meta.env.VITE_BACKENDURL,
        method: "get",
        url: "main/shop/recent",
      });
      this.shops = shops.data;

      const categories = await axios({
        baseURL: import.meta.env.VITE_BACKENDURL,
        method: "get",
        url: "main/category/all",
      });
      this.categories = categories.data;

      // console.table(this.products);
      // console.table(this.shops);
      // console.table(this.categories);

      this.dataLoaded = true;
    } catch (e) {
      this.loadError = "Unable to load catalog data. Check the backend connection.";
      console.log(e);
    }
  },

  methods: {
    trimText(text = "", n = 20) {
      return text.substring(0, n) + "...";
    },
  },
};
</script>

<template>
  <main class="market-container pb-16 pt-5">
    <section class="grid overflow-hidden rounded-2xl bg-slate-900 shadow-xl lg:grid-cols-[1.1fr_.9fr]">
      <div class="flex flex-col justify-center px-7 py-12 sm:px-12 lg:py-16">
        <p class="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-cyan-300">Fresh finds, thoughtfully picked</p>
        <h1 class="max-w-xl text-4xl font-black leading-tight text-white sm:text-6xl">Good things should be easy to find.</h1>
        <p class="mt-5 max-w-lg text-base leading-7 text-slate-300">Explore useful pieces from independent makers and bring a little more intention to your everyday.</p>
        <div class="mt-8 flex flex-wrap gap-3">
          <a href="#products" class="rounded-md bg-cyan-400 px-5 py-3 font-bold text-slate-950 hover:bg-cyan-300">Shop the collection</a>
          <a href="#categories" class="rounded-md border border-slate-600 px-5 py-3 font-bold text-white hover:border-cyan-300">Browse categories</a>
        </div>
      </div>
      <div class="relative min-h-64 bg-cover bg-center" style="background-image: url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200')">
        <div class="absolute inset-0 bg-gradient-to-r from-slate-900 via-transparent to-transparent"></div>
        <div class="absolute bottom-6 right-6 rounded-lg bg-white p-4 shadow-lg">
          <p class="text-xs font-bold uppercase text-slate-400">This week</p>
          <p class="mt-1 text-lg font-black text-slate-900">12 new arrivals</p>
        </div>
      </div>
    </div>
    <div class="my-8 grid grid-cols-2 gap-3 rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm sm:grid-cols-4">
      <div><p class="text-2xl font-black text-indigo-600">24h</p><p class="text-xs font-bold uppercase text-slate-400">Fast dispatch</p></div>
      <div><p class="text-2xl font-black text-indigo-600">100%</p><p class="text-xs font-bold uppercase text-slate-400">Curated finds</p></div>
      <div><p class="text-2xl font-black text-indigo-600">4.8/5</p><p class="text-xs font-bold uppercase text-slate-400">Happy buyers</p></div>
      <div><p class="text-2xl font-black text-indigo-600">Secure</p><p class="text-xs font-bold uppercase text-slate-400">Checkout</p></div>
    </div>
    <section id="products">
      <div class="mb-5 flex items-end justify-between">
        <div><p class="text-sm font-bold uppercase tracking-wider text-indigo-600">Handpicked for you</p><h2 class="mt-1 text-3xl font-black text-slate-900">Trending now</h2></div>
        <span class="hidden text-sm text-slate-500 sm:block">New season essentials</span>
      </div>
    <p v-if="loadError" class="text-error">{{ loadError }}</p>
    <p v-else-if="dataLoaded && !products.length" class="text-base-content/70">
      No products have been added yet.
    </p>
    <ProductGrid v-else :products="this.products"></ProductGrid>
    </section>
    <section class="mt-12" id="shops">
    <div class="mb-5"><p class="text-sm font-bold uppercase tracking-wider text-indigo-600">Meet the makers</p><h2 class="mt-1 text-3xl font-black text-slate-900">Featured shop</h2></div>
    <p v-if="dataLoaded && !shops.length" class="text-base-content/70">
      No shops have been added yet.
    </p>
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
      <div
        v-for="(shop, key) in this.shops"
        :key="key"
        class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
      >
        <figure>
          <img :src="shop.logo" :alt="shop.name" />
        </figure>
        <div class="card-body">
          <h2 class="text-xl font-black text-slate-800">{{ shop.name }}</h2>
          <p class="mt-2 text-sm text-slate-500">{{ trimText(shop.description, 100) }}</p>
          <div class="card-actions justify-end">
            <router-link :to="'/shop/' + shop._id" class="mt-4 inline-block rounded-md bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-600"
              >Visit Shop</router-link
            >
          </div>
        </div>
      </div>
    </div>
    </section>
    <section class="mt-12" id="categories">
    <div class="mb-5"><p class="text-sm font-bold uppercase tracking-wider text-indigo-600">Shop by mood</p><h2 class="mt-1 text-3xl font-black text-slate-900">Browse categories</h2></div>
    <p v-if="dataLoaded && !categories.length" class="text-base-content/70">
      No categories have been added yet.
    </p>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div
        v-for="(category, key) in this.categories"
        :key="key"
        class="rounded-xl bg-indigo-600 shadow-sm transition hover:-translate-y-1 hover:bg-slate-900"
      >
        <div class="card-body items-center justify-center">
          <router-link
            :to="'/category/' + category._id"
            class="text-xl font-black text-white hover:underline"
            >{{ category.name }}</router-link
          >
        </div>
      </div>
    </div>
    </section>
  </main>
</template>
