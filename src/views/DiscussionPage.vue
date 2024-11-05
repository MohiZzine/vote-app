<template>
  <div class="bg-[#030303] min-h-screen text-[#D7DADC]">
    <Navbar />
    <div class="max-w-4xl mx-auto pt-16 px-4">
      <div class="bg-[#1A1A1B] rounded-md">
        <DiscussionDetail />
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '../components/Layout/NavBar.vue';
import DiscussionDetail from '../components/Discussion/DiscussionDetail.vue';

export default {
  components: { Navbar, DiscussionDetail }
};
</script>