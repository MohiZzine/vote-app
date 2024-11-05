<template>
  <div class="bg-[#1A1A1B] min-h-screen">
    <Navbar />
    <div class="max-w-4xl mx-auto px-4 py-6">
      <h1 class="text-2xl font-bold text-[#D7DADC] mb-4">Tag: {{ $route.params.tag }}</h1>
      
      <!-- Tag Search Form -->
      <form @submit.prevent="searchTag" class="mb-6">
        <div class="flex">
          <input 
            v-model="searchQuery"
            type="text"
            placeholder="Search for a tag..."
            class="flex-grow px-4 py-2 bg-[#272729] text-[#D7DADC] border border-[#343536] rounded-l focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:border-[#FF4500]"
          />
          <button 
            type="submit"
            class="px-6 py-2 bg-[#FF4500] text-white rounded-r hover:bg-opacity-90 transition-colors duration-200"
          >
            Search
          </button>
        </div>
      </form>

      <!-- View Discussion Button -->
      <button
        class="text-sm text-[#FF4500] hover:bg-[#272729] py-1 px-3 rounded-full transition-colors duration-200 mb-4"
        @click="viewAllDiscussions"
      >
        View All Discussions
      </button>

      <div class="bg-[#1A1A1B] rounded-lg border border-[#343536]">
        <DiscussionListCategory :tag="$route.params.tag" />
      </div>
    </div>
  </div>
</template>



<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Navbar from '../components/Layout/NavBar.vue';
import DiscussionListCategory from '../components/Discussion/DiscussionListCategory.vue';

export default {
  components: { Navbar, DiscussionListCategory },
  setup() {
    const router = useRouter();
    const searchQuery = ref('');

    const searchTag = () => {
      if (searchQuery.value.trim()) {
        router.push(`/categories/${encodeURIComponent(searchQuery.value.trim())}`);
      }
    };

    const viewAllDiscussions = () => {
      router.push('/all-categories');
    };

    return {
      searchQuery,
      searchTag,
      viewAllDiscussions
    };
  }
};
</script>




