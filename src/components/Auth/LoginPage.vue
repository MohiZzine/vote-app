<template>
  <div class="bg-[#1A1A1B] min-h-screen flex items-center justify-center">
    <div class="w-full max-w-md bg-[#1A1A1B] p-8 rounded-lg shadow-lg border border-[#343536]">
      <div class="flex justify-center mb-6">
        <img src="/reddit-logo.svg" alt="Reddit" class="h-12 w-12" />
      </div>
      <h2 class="text-2xl font-bold text-center text-[#D7DADC] mb-6">Log In</h2>
      <form @submit.prevent="login" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-[#D7DADC]">Email</label>
          <input 
            v-model="email" 
            type="email" 
            required 
            class="mt-1 px-3 py-2 bg-[#272729] text-[#D7DADC] border border-[#343536] rounded w-full focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:border-[#FF4500]"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-[#D7DADC]">Password</label>
          <input 
            v-model="password" 
            type="password" 
            required 
            class="mt-1 px-3 py-2 bg-[#272729] text-[#D7DADC] border border-[#343536] rounded w-full focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:border-[#FF4500]"
          />
        </div>
        <div class="space-y-2">
          <button type="submit" class="w-full px-4 py-2 bg-[#FF4500] text rounded hover:bg-opacity-90 transition-all">
            Log In
          </button>
          <div class="text-sm text-[#818384] text-center">
            New to Reddit? 
            <button @click="goToSignUp" type="button" class="text-[#FF4500] hover:underline">
              Sign Up
            </button>
          </div>
          <button @click="goToResetPassword" type="button" class="w-full px-4 py-2 text-[#FF4500] hover:underline text-sm">
            Forgot Password?
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { auth } from '../../firebase';

export default {
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    async login() {
      try {
        await auth.signInWithEmailAndPassword(this.email, this.password);
        this.$router.push('/');
      } catch (error) {
        alert(error.message);
      }
    },
    goToSignUp() {
      this.$router.push('/register');
    },
    goToResetPassword() {
      this.$router.push('/password-reset');
    }
  }
};
</script>

<style scoped>
/* Custom Colors */
.bg-dark-blue {
  background-color: #15202b; /* X-like dark background */
}
.bg-dark-accent {
  background-color: #192734; /* Slightly lighter for form container */
}
.bg-accent {
  background-color: #1DA1F2; /* Accent color for buttons */
}
.bg-accent-dark {
  background-color: #1a8cd8; /* Darker accent for hover effect */
}
.text-accent {
  color: #1DA1F2; /* X-like text color for links */
}
.focus\:border-accent:focus {
  border-color: #1DA1F2;
}
.focus\:ring:focus {
  box-shadow: 0 0 0 3px rgba(29, 161, 242, 0.3);
}
</style>
