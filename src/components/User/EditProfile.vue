<template>
  <div class="bg-[#030303] min-h-screen text-[#D7DADC]">
    <Navbar />
    <div class="max-w-md mx-auto pt-20 px-4">
      <div class="bg-[#1A1A1B] rounded-lg shadow-xl p-8">
        <h2 class="text-3xl font-bold mb-6 text-center">Update Profile</h2>
        <form @submit.prevent="updateProfile" class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium mb-2">Name</label>
            <input
              id="name"
              v-model="name"
              type="text"
              required
              class="w-full px-4 py-2 bg-[#272729] border border-[#343536] rounded-lg focus:ring-2 focus:ring-[#FF4500] focus:border-transparent"
              placeholder="Enter your name"
            />
          </div>
          <button
            type="submit"
            class="w-full bg-[#FF4500] hover:bg-[#FF5722] text font-bold py-3 px-4 rounded transition-all duration-300"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Layout/NavBar.vue";
import { auth, db } from "../../firebase";

export default {
  components: { Navbar },
  data() {
    return {
      name: auth.currentUser.displayName || "",
    };
  },
  methods: {
    async updateProfile() {
      const user = auth.currentUser;
      try {
        await user.updateProfile({ displayName: this.name });
        await db.collection("users").doc(user.uid).update({ name: this.name });
        this.$router.push("/user-profile");
      } catch (error) {
        console.error("Error updating profile:", error);
        // You might want to show an error message to the user here
      }
    },
  },
};
</script>