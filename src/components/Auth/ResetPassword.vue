<template>
  <div class="bg-[#1A1A1B] min-h-screen flex flex-col">
    <Navbar />
    <div class="flex-grow flex items-center justify-center px-4 py-8">
      <div class="w-full max-w-md bg-[#1A1A1B] p-8 rounded-lg shadow-lg border border-[#343536]">
        <div class="flex justify-center mb-6">
          <img src="/reddit-logo.svg" alt="Reddit" class="h-12 w-12" />
        </div>
        <h2 class="text-2xl font-bold text-center text mb-6">Reset Your Password</h2>
        <form @submit.prevent="resetPassword" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text">Email</label>
            <input 
              v-model="email" 
              type="email" 
              required 
              class="mt-1 px-3 py-2 bg-[#272729] text border border-[#343536] rounded w-full focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:border-[#FF4500]"
            />
          </div>
          <div class="space-y-2">
            <button type="submit" class="w-full px-4 py-2 bg-[#FF4500] text rounded hover:bg-opacity-90 transition-all">
              Reset Password
            </button>
            <div class="text-sm text-[#818384] text-center">
              Remember your password? 
              <router-link to="/login" class="text-[#FF4500] hover:underline">
                Log In
              </router-link>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Layout/NavBar.vue";
import { auth } from '../../firebase';

export default {
  components: { Navbar },
  data() {
    return {
      email: ''
    };
  },
  methods: {
    async resetPassword() {
      try {
        await auth.sendPasswordResetEmail(this.email);
        alert('Password reset email sent');
        this.$router.push('/login');
      } catch (error) {
        alert(error.message);
      }
    }
  }
};
</script>