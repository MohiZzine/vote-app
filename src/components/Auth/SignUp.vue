<template>
  <div class="bg-[#1A1A1B] min-h-screen flex items-center justify-center">
    <div class="w-full max-w-md bg-[#1A1A1B] p-8 rounded-lg shadow-lg border border-[#343536]">
      <div class="flex justify-center mb-6">
        <img src="/reddit-logo.svg" alt="Reddit" class="h-12 w-12" />
      </div>
      <h2 class="text-2xl font-bold text-center text mb-6">Sign Up</h2>
      <form @submit.prevent="signUp" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text">Email</label>
          <input 
            v-model="email" 
            type="email" 
            required 
            class="mt-1 px-3 py-2 bg-[#272729] text border border-[#343536] rounded w-full focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:border-[#FF4500]"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text">Password</label>
          <input 
            v-model="password" 
            type="password" 
            required 
            class="mt-1 px-3 py-2 bg-[#272729] text border border-[#343536] rounded w-full focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:border-[#FF4500]"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text">Confirm Password</label>
          <input 
            v-model="confirmPassword" 
            type="password" 
            required 
            class="mt-1 px-3 py-2 bg-[#272729] text border border-[#343536] rounded w-full focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:border-[#FF4500]"
          />
        </div>
        <div class="space-y-2">
          <button type="submit" class="w-full px-4 py-2 bg-[#FF4500] text rounded hover:bg-opacity-90 transition-all">
            Sign Up
          </button>
          <div class="text-sm text-[#818384] text-center">
            Already have an account? 
            <button @click="goToLogin" type="button" class="text-[#FF4500] hover:underline">
              Log In
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { db, auth } from '../../firebase';

export default {
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: ''
    };
  },
  methods: {
    async signUp() {
      if (this.password !== this.confirmPassword) {
        alert('Passwords do not match');
        return;
      }

      try {
        // Check for existing username
        const userSnapshot = await db.collection('users').get();
        if (!userSnapshot.empty) {
          alert('Username is already taken');
          return;
        }

        // Create user
        const userCredential = await auth.createUserWithEmailAndPassword(this.email, this.password);

        // Store user information in Firestore
        await db.collection('users').doc(userCredential.user.uid).set({
          userid: userCredential.user.uid,
          email: this.email
        }, { merge: true });

        this.$router.push('/');
      } catch (error) {
        alert(`Signup failed: ${error.message}`);
      }
    },
    goToLogin() {
      this.$router.push('/login');
    }
  }
};
</script>