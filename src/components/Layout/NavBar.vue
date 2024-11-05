<template>
  <nav class="bg-[#1A1A1B] border-b border-[#343536] fixed w-full top-0 z-50 h-14 px-4 flex items-center">
    <div class="flex items-center justify-between max-w-[1200px] w-full mx-auto">
      <!-- Logo -->
      <router-link to="/" class="flex items-center space-x-2">
        <svg class="w-8 h-8 text-[#FF4500]" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm5.93 11.79c-.14.45-.5.8-.95.99-1.1.46-2.84.07-3.58-.82a.75.75 0 00-1.08 0c-.74.89-2.49 1.28-3.58.82-.45-.19-.81-.54-.95-.99-.37-1.17.39-2.29 1.46-2.89.61-.34 1.36-.51 2.13-.51s1.52.17 2.13.51c1.07.6 1.83 1.72 1.46 2.89zm-8.67-2.44c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm7.48 0c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z"/>
        </svg>
        <span class="text-[#FF4500] font-semibold text-lg">University Vote</span>
      </router-link>

      <!-- Navigation Links -->
      <div class="flex items-center space-x-4 text-[#D7DADC]">
        <router-link to="/" class="hover:bg-[#272729] px-2 py-1 rounded">Home</router-link>
        <router-link to="/all-categories" class="hover:bg-[#272729] px-2 py-1 rounded">Events</router-link>

      </div>

      <!-- User Actions -->
      <div class="flex items-center space-x-2">
        <template v-if="!user">
          <router-link to="/login" class="bg-[#D7DADC] text-[#1A1A1B] px-4 py-1 rounded-full text-sm font-bold hover:bg-white">Log In</router-link>
          <router-link to="/register" class="bg-[#FF4500] text-[#1A1A1B] px-4 py-1 rounded-full text-sm font-bold hover:bg-[#FF5722]">Sign Up</router-link>
        </template>
        <template v-else>
          <router-link to="/user-profile" class="hover:bg-[#272729] p-1 rounded-full">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
            </svg>
          </router-link>
          <button @click="logout" class="hover:bg-[#272729] p-1 rounded-full">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd" />
            </svg>
          </button>
        </template>
      </div>
    </div>
  </nav>
</template>

<script>
import { auth } from "../../firebase";

export default {
  data() {
    return {
      user: null,
    };
  },
  created() {
    auth.onAuthStateChanged((user) => {
      this.user = user;
    });
  },
  methods: {
    logout() {
      auth.signOut();
      this.$router.push('/');
    },
  },
};
</script>