<template>
  <div class="bg-[#1A1A1B] min-h-screen">
    <Navbar />
    <div class="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row gap-6">

        <!-- Main content -->
        <div class="flex-grow">
          <div class="bg-[#1A1A1B] rounded-lg border border-[#343536]">
            <DiscussionList />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/Layout/NavBar.vue";
import DiscussionList from "../components/Discussion/DiscussionList.vue";

export default {
  components: { Navbar, DiscussionList },
};
</script>