<template>
  <div class="bg-[#030303] min-h-screen text-[#D7DADC]">
    <Navbar />
    <div class="max-w-4xl mx-auto pt-20 px-4">
      <h2 class="text-3xl font-bold mb-6 text-center">User Profile</h2>
      <div class="bg-[#1A1A1B] rounded-md p-6 shadow-lg">
        <UserProfile />
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '../components/Layout/NavBar.vue';
import UserProfile from '../components/User/UserProfile.vue';

export default {
  components: { Navbar, UserProfile }
};
</script>