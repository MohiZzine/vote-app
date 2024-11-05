<template>
  <div class="text-[#D7DADC]">
    <div class="text-center mb-8">
      <img
        :src="user.photoURL || 'https://www.redditstatic.com/avatars/defaults/v2/avatar_default_0.png'"
        alt="User Avatar"
        class="w-32 h-32 rounded-full border-4 border-[#FF4500] mx-auto"
      />
    </div>
    <div class="mb-6 space-y-2">
      <p class="text-xl"><span class="font-semibold">Name:</span> {{ user.displayName || 'N/A' }}</p>
      <p class="text-xl"><span class="font-semibold">Email:</span> {{ user.email }}</p>
    </div>
    <button
      @click="editProfile"
      class="w-full bg-[#FF4500] hover:bg-[#FF5722] text font-bold py-3 px-4 rounded transition-all duration-300"
    >
      Edit Profile
    </button>
  </div>
</template>

<script>
import { auth } from '../../firebase';

export default {
  data() {
    return {
      user: null,
    };
  },
  created() {
    this.user = auth.currentUser;
  },
  methods: {
    editProfile() {
      this.$router.push('/edit-user');
    },
  },
};
</script>