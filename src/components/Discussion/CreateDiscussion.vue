<template>
  <div class="bg-[#1A1A1B] min-h-screen flex flex-col">
    <Navbar />
    <div class="flex-grow container mx-auto px-4 py-8">
      <div class="max-w-3xl mx-auto bg-[#1A1A1B] p-6 rounded-lg shadow-lg border border-[#343536]">
        <h2 class="text-2xl font-bold text-center mb-6 text-[#D7DADC]">Create a New Discussion</h2>
        <form @submit.prevent="createDiscussion" class="space-y-6">
          <!-- Title Input -->
          <div>
            <label class="block text-sm font-medium text-[#D7DADC]">Title</label>
            <input
              v-model="title"
              required
              type="text"
              class="mt-1 px-3 py-2 w-full bg-[#272729] text-[#D7DADC] border border-[#343536] rounded focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:border-[#FF4500]"
            />
          </div>

          <!-- Content Input -->
          <div>
            <label class="block text-sm font-medium text-[#D7DADC]">Content</label>
            <textarea
              v-model="content"
              required
              class="mt-1 px-3 py-2 w-full bg-[#272729] text-[#D7DADC] border border-[#343536] rounded focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:border-[#FF4500]"
              rows="6"
            ></textarea>
          </div>

          <!-- Tags Input -->
          <div>
            <label class="block text-sm font-medium text-[#D7DADC]">Tags</label>
            
            <div class="flex">
              <input
                v-model="tagInput"
                @keydown.enter.prevent="addTag"
                type="text"
                placeholder="Enter a tag and press Enter"
                class="flex-grow px-3 py-2 bg-[#272729] text-[#D7DADC] border border-[#343536] rounded-l focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:border-[#FF4500]"
              />
            </div>
            <div class="mt-2 flex flex-wrap gap-2">
              <span 
                v-for="(tag, index) in tags" 
                :key="index" 
                class="bg-[#272729] text-[#FF4500] px-2 py-1 rounded-full text-sm flex items-center"
              >
                {{ tag }}
                <button @click="removeTag(index)" class="ml-2 text hover:text-[#FF4500]">&times;</button>
              </span>
            </div>
          </div>

          <!-- Submit Button -->
          <div>
            <button
              type="submit"
              class="w-full px-4 py-2 bg-[#FF4500] text font-semibold rounded hover:bg-opacity-90 transition-all"
            >
              Post Discussion
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Layout/NavBar.vue";
import { db, auth } from "../../firebase";

export default {
  components: { Navbar },
  data() {
    return {
      title: "",
      content: "",
      tags: [],
      tagInput: "",
    };
  },
  methods: {
    addTag() {
      const tag = this.tagInput.trim();
      if (tag && !this.tags.includes(tag)) {
        this.tags.push(tag);
        this.tagInput = "";
      }
    },
    removeTag(index) {
      this.tags.splice(index, 1);
    },
    async createDiscussion() {
      if (this.tags.length === 0) {
        alert("Please enter at least one tag.");
        return;
      }

      const user = auth.currentUser;
      try {
        await db.collection("discussions").add({
          title: this.title,
          content: this.content,
          author: user.uid,
          createdAt: new Date(),
          tags: this.tags,
        });
        this.$router.push("/");
      } catch (error) {
        alert(error.message);
      }
    },
  },
};
</script>