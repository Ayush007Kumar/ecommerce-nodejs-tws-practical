<script>
import axios from "axios";
import { useUserStore } from "@/stores/user";
import router from "@/router";

export default {
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },

  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
    };
  },

  methods: {
    async login() {
      try {
        this.errorMessage = "";
        const token = await axios({
          baseURL: import.meta.env.VITE_BACKENDURL,
          method: "post",
          url: "/user/login",
          data: {
            email: this.email,
            password: this.password,
          },
        });
        this.userStore.setToken(token.data);
        const user = this.userStore.getUser;
        await router.push(user.role === "admin" ? "/admin" : user.role === "seller" ? "/dashboard" : "/");
      } catch (e) {
        this.errorMessage = e.response?.data || "Login failed. Check your email and password.";
        console.log(e);
      }
    },
  },
};
</script>

<template>
  <main>
    <form
      class="form-control w-full max-w-xs mx-auto my-40 gap-4"
      @submit.prevent="login"
    >
      <div>
        <label class="label">
          <span class="label-text">Email:</span>
        </label>
        <input
          type="email"
          placeholder="Type here"
          class="input input-bordered w-full max-w-xs"
          v-model="email"
        />
      </div>
      <div>
        <label class="label">
          <span class="label-text">Password:</span>
        </label>
        <input
          type="password"
          placeholder="Type here"
          class="input input-bordered w-full max-w-xs"
          v-model="password"
        />
      </div>

      <button class="btn btn-outline btn-primary w-full">Log In</button>

      <p v-if="errorMessage" class="text-error text-sm">{{ errorMessage }}</p>

      <small class="text-right text-xs"
        >Don't have an account? Register
        <router-link to="/register" class="text-primary hover:underline"
          >Here</router-link
        >.</small
      >
    </form>
  </main>
</template>
