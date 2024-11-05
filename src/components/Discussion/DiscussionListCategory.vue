<template>
  <div v-if="!loading" class="space-y-4">
    <div
      v-for="discussion in filteredDiscussions"
      :key="discussion.id"
      class="bg-[#1A1A1B] p-4 rounded-lg border border-[#343536] hover:border-[#818384] transition-colors duration-200"
    >
      <div class="flex justify-between items-start mb-2">
        <h5 class="text-lg font-semibold text-[#D7DADC]">{{ discussion.title }}</h5>
        <span class="text-xs text-[#818384]">Posted by u/{{ discussion.username }}</span>
      </div>
      <p class="text-sm text-[#D7DADC] mb-3">{{ truncateContent(discussion.content) }}</p>
      <div class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
        <button
          class="text-sm text-[#FF4500] hover:bg-[#272729] py-1 px-3 rounded-full transition-colors duration-200"
          @click="viewDiscussion(discussion.id)"
        >
          View Discussion
        </button>
        <div class="flex flex-wrap space-x-2">
          <span
            v-for="(tag, index) in discussion.tags"
            :key="index"
            class="text-xs bg-[#272729] text-[#4FBCFF] px-2 py-1 rounded-full cursor-pointer hover:bg-[#343536] transition-colors duration-200"
            @click.prevent="this.$router.push('/categories/' + tag)"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </div>
  </div>

  <div v-if="loading" class="flex items-center justify-center h-64">
    <div class="text-center">
      <p class="text-lg text-[#D7DADC] mb-4">Loading, please wait...</p>
      <div class="w-64 h-2 bg-[#343536] rounded-full overflow-hidden">
        <div class="h-full bg-[#FF4500]" :style="{ width: `${progress}%` }"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "../../firebase";

export default {
  props: ["tag"],
  data() {
    return {
      discussions: [],
      loading: true,
      progress: 0,
      searchQuery: "",
      filteredDiscussions: [],
      tagsfilter: [],
    };
  },
  async created() {
    if (this.tag) {
      this.tagsfilter = [this.tag];
    }

    try {
      const query = this.categoryId
        ? db.collection("discussions").where("category", "==", this.categoryId)
        : db.collection("discussions");
      const snapshot = await query.orderBy("createdAt", "desc").get();
      this.progress += 30;
      this.discussions = [];

      for (const doc of snapshot.docs) {
        this.progress += parseInt((70)/snapshot.docs.length)

        const discussion = { id: doc.id, ...doc.data() };
        const userSnapshot = await db
          .collection("users")
          .doc(discussion.author)
          .get();
        if (userSnapshot.exists) {
          discussion.username = userSnapshot.data().name;
        } else {
          discussion.username = "Unknown";
        }
        this.discussions.push(discussion);
      }
      this.filteredDiscussions = this.discussions;
      this.searchRelevantDiscussions(["temp"]);
    } catch (error) {
      console.error("Error fetching discussions or users:", error);
    }

    this.loading = false;
  },
  methods: {
    viewDiscussion(id) {
      this.$router.push(`/discussion/${id}`);
    },
    truncateContent(content) {
      const limit = 100;
      if (content.length > limit) {
        return content.substring(0, limit) + "...";
      }
      return content;
    },
    searchRelevantDiscussions(newvalue) {
      if (this.tagsfilter.length === 0 || newvalue.length === 0) {
        this.filteredDiscussions = this.discussions;
        return;
      }
      const lowerCaseTags = this.tagsfilter.map((tag) => tag.toLowerCase());

      const relevantDiscussions = this.discussions.map((discussion) => {
        const matchingTags = discussion.tags
          ? discussion.tags.filter((tag) =>
              lowerCaseTags.includes(tag.toLowerCase())
            ).length
          : 0;
        return { ...discussion, relevance: matchingTags };
      });

      this.filteredDiscussions = relevantDiscussions
        .filter((discussion) => discussion.relevance > 0)
        .sort((a, b) => b.relevance - a.relevance);
    },
  },
  watch: {
    tag(newvalue) {
      if (newvalue) {
        this.tagsfilter = [newvalue];
      } else {
        this.tagsfilter = [];
      }
    },
    tagsfilter: {
      handler(newvalue) {
        this.searchRelevantDiscussions(newvalue);
      },
      deep: true,
    },
  },
};
</script>
