<script>
import axios from "axios";
import { useUserStore } from "@/stores/user";
import { useCartStore } from "@/stores/cart";

export default {
  setup() {
    const userStore = useUserStore();
    const cartStore = useCartStore();
    return { userStore, cartStore };
  },
  data() {
    return {
      user: {
        isLoggedIn: false,
        token: this.userStore.getToken || "",
        role: "",
        id: "",
        email: "",
        username: "",
        avatar: "",
      },
    };
  },
  async created() {
    if (this.user.token) {
      this.user.isLoggedIn = true;

      const tokenUser = this.userStore.getUser;
      this.user.role = tokenUser.role;
      this.user.id = tokenUser.id;

      const user = await axios({
        baseURL: import.meta.env.VITE_BACKENDURL,
        method: "get",
        url: "/user/show",
        params: {
          userID: this.user.id,
        },
      });

      this.user.email = user.data.email;
      this.user.username = user.data.username;
      this.user.avatar = user.data.avatar;
    }
  },
  methods: {
    logOut() {
      try {
        this.userStore.removeToken();
        this.user.isLoggedIn = false;
        console.log(this.userStore.getToken);
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<template>
  <div class="market-shell">
  <header class="border-b border-slate-200 bg-white shadow-sm">
    <div class="market-container flex min-h-20 items-center gap-4">
    <div class="navbar-start w-auto sm:w-1/2">
      <div class="dropdown">
        <label tabindex="0" class="btn btn-ghost text-slate-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
        </label>
        <ul
          tabindex="0"
          class="menu menu-compact dropdown-content mt-3 p-2 shadow-md bg-base-100 rounded-md w-52"
        >
          <li><router-link to="/">Homepage</router-link></li>
        </ul>
      </div>
    </div>
    <div class="navbar-center">
      <router-link to="/" class="text-xl font-black tracking-tight text-slate-900 sm:text-2xl"
        ><span class="text-indigo-600">Northstar</span> Market</router-link
      >
    </div>
    <div class="hidden flex-1 md:block">
      <label class="flex h-11 items-center gap-3 rounded-md bg-slate-100 px-4 text-sm text-slate-400">
        <span class="text-lg">⌕</span>
        <input class="w-full bg-transparent outline-none" placeholder="Search products, shops and more" />
      </label>
    </div>
    <div class="navbar-end">
      <div class="dropdown dropdown-end">
        <label tabindex="0" class="btn btn-ghost">
          <div class="indicator">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span class="badge badge-sm indicator-item">{{ cartStore.itemCount }}</span>
          </div>
        </label>
        <div
          tabindex="0"
          class="mt-3 card card-compact dropdown-content w-52 bg-base-100 shadow-md rounded-md"
        >
          <div class="card-body">
            <span class="font-bold text-lg">{{ cartStore.itemCount }} Items</span>
            <span class="text-info">Subtotal: ${{ cartStore.subtotal.toFixed(2) }}</span>
            <div class="card-actions">
              <router-link to="/cart" class="btn btn-primary btn-block"
                >View cart</router-link
              >
            </div>
          </div>
        </div>
      </div>
      <router-link
        to="/login"
        class="rounded-md bg-indigo-600 px-4 py-2 font-bold text-white hover:bg-indigo-700"
        :class="{ hidden: this.user.isLoggedIn }"
      >
        Log In
      </router-link>
      <div
        class="dropdown dropdown-end"
        :class="{ hidden: !this.user.isLoggedIn }"
      >
        <label tabindex="0" class="btn btn-ghost btn-circle avatar">
          <div class="w-10 rounded-full">
            <img :src="this.user.avatar" />
          </div>
        </label>
        <ul
          tabindex="0"
          class="menu menu-compact dropdown-content mt-3 p-2 shadow-md bg-base-100 rounded-md w-52"
        >
          <li>
            <router-link to="/profile" class="justify-between"
              >Profile</router-link
            >
          </li>
          <li v-if="this.user.role == 'seller'">
            <router-link to="/dashboard" class="justify-between"
              >Dashboard</router-link
            >
          </li>
          <li v-if="this.user.role == 'admin'">
            <router-link to="/admin" class="justify-between">Admin</router-link>
          </li>
          <li>
            <a @click="this.logOut()">Logout</a>
          </li>
        </ul>
      </div>
    </div>
    </div>
    <nav class="hidden border-t border-slate-100 bg-white md:block">
      <div class="market-container flex h-11 items-center gap-8 text-sm font-bold text-slate-500">
        <router-link to="/" class="hover:text-indigo-600">Home</router-link>
        <a href="/#products" class="hover:text-indigo-600">Trending</a>
        <a href="/#shops" class="hover:text-indigo-600">Shops</a>
        <a href="/#categories" class="hover:text-indigo-600">Categories</a>
      </div>
    </nav>
  </header>
  <router-view :userID="user.id"></router-view>
  <footer class="mt-10 border-t border-slate-200 bg-slate-900 px-6 py-10 text-center text-slate-400">
    <div class="grid grid-flow-col gap-4">
      <a class="link link-hover">About us</a>
      <a class="link link-hover">Contact</a>
      <a class="link link-hover">Jobs</a>
      <a class="link link-hover">Press kit</a>
    </div>
    <div>
      <div class="grid grid-flow-col gap-4">
        <a
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            class="fill-current"
          >
            <path
              d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"
            ></path></svg
        ></a>
        <a
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            class="fill-current"
          >
            <path
              d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"
            ></path></svg
        ></a>
        <a
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            class="fill-current"
          >
            <path
              d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"
            ></path></svg
        ></a>
      </div>
    </div>
    <div>
      <p>Copyright 2026 Northstar Market. All rights reserved.</p>
    </div>
  </footer>
  </div>
</template>

<style></style>
