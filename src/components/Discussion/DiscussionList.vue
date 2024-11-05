<template>
  <div class="bg-[#1A1A1B] text-[#D7DADC] min-h-screen">
    <!-- Header -->
    <header class="bg-[#1A1A1B] border-b border-[#343536] p-2 flex items-center justify-between">
      <div class="flex items-center">
        <h1 class="text-xl font-semibold">Welcome again</h1>
      </div>
      <div class="flex items-center">
        <input 
          v-model="searchQuery"
          @input="searchPosts"
          type="text" 
          placeholder="Search Vote" 
          class="bg-[#272729] text-[#D7DADC] rounded-full px-4 py-1 mr-2 focus:outline-none focus:ring-2 focus:ring-[#D7DADC]"
        />
        <button @click="$router.push('/login')" class="bg-[#FF4500] text-white px-4 py-1 rounded-full hover:bg-opacity-80">
          Log In
        </button>
      </div>
    </header>

    <!-- Main content -->
    <div class="container mx-auto py-4 px-2">
      <!-- Discussion list -->
      <div v-if="!loading" class="space-y-4">
        <div 
          v-for="discussion in filteredDiscussions" 
          :key="discussion.id"
          class="bg-[#1A1A1B] rounded-md border border-[#343536] p-4 hover:border-[#D7DADC]"
        >
          <div class="flex items-start">
            <div class="flex-grow">
              <h3 @click="viewDiscussion(discussion.id)" class="text-lg font-semibold mb-2 cursor-pointer hover:text-[#FF4500]">
                {{ discussion.title }}
              </h3>
              <p class="text-sm text-[#818384] mb-2">
                Posted by u/{{ discussion.title }} {{ formatTimeAgo(discussion.createdAt) }}
              </p>
              <p class="mb-2">{{ truncateContent(discussion.content) }}</p>
              


              <div class="flex items-center space-x-4 text-sm text-[#818384]">
                <button @click="viewDiscussion(discussion.id)" class="hover:bg-[#272729] rounded p-1 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  View Discussion
                </button>
                <button @click="toggleLike(discussion)" class="hover:bg-[#272729] rounded p-1 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" :class="{ 'text-red-500 fill-current': discussion.isLiked }" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
                  </svg>
                  {{ discussion.likeCount }} Likes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading skeleton -->
      <div v-if="loading" class="space-y-4">
        <div v-for="i in 5" :key="i" class="bg-[#1A1A1B] rounded-md border border-[#343536] p-4 animate-pulse">
          <div class="h-4 bg-[#343536] rounded w-3/4 mb-2"></div>
          <div class="h-4 bg-[#343536] rounded w-1/2 mb-2"></div>
          <div class="h-4 bg-[#343536] rounded w-full"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db, auth } from "../../firebase";

export default {
  data() {
    return {
      discussions: [],
      loading: true,
      filteredDiscussions: [],
      currentUser: null,
    };
  },
  async created() {
    try {
      const query = db.collection("events").get();
      console.log(query.docs);
      this.discussions = [];

      for (const doc of query.docs) {
        const discussion = { id: doc.id, ...doc.data() };
        this.discussions.push(discussion);
      }
      this.filteredDiscussions = this.discussions;
      console.log(this.filteredDiscussions);
    } catch (error) {
      console.error("Error fetching discussions or users:", error);
    }

    this.loading = false;

    // Get current user
    this.currentUser = auth.currentUser;

    // Fetch likes for each discussion
    for (const discussion of this.discussions) {
      const likesSnapshot = await db.collection("likes")
        .where("discussionId", "==", discussion.id)
        .get();
      
      discussion.likeCount = likesSnapshot.size;
      discussion.isLiked = likesSnapshot.docs.some(doc => doc.data().userId === this.currentUser?.uid);
    }

    this.filteredDiscussions = this.discussions;
  },
  methods: {
    viewDiscussion(id) {
      this.$router.push(`/discussion/${id}`);
    },
    truncateContent(content) {
      const limit = 150;
      return content.length > limit ? content.substring(0, limit) + "..." : content;
    },
    formatTimeAgo(timestamp) {
      // If the timestamp is a Firestore timestamp (with seconds and nanoseconds)
      if (timestamp && timestamp.seconds && timestamp.nanoseconds) {
        // Convert Firestore timestamp to JavaScript Date object
        timestamp = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
      }

      // Ensure the timestamp is a valid Date object now
      if (!timestamp || isNaN(new Date(timestamp).getTime())) {
        console.log("Invalid timestamp:", timestamp);
        return "";
      }

      const now = new Date();
      const postTime = new Date(timestamp);
      const diffInSeconds = Math.floor((now - postTime) / 1000);
      
      if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
      if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
      if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
      
      return `${Math.floor(diffInSeconds / 31536000)} years ago`;
    },
    searchPosts() {
      const lowerCaseQuery = this.searchQuery.toLowerCase();

      this.filteredDiscussions = this.discussions.filter((discussion) => {
        const titleMatch = discussion.title
          .toLowerCase()
          .includes(lowerCaseQuery);

        const contentMatch = discussion.content
          .toLowerCase()
          .includes(lowerCaseQuery);

        return titleMatch || contentMatch;
      });
    },
    async removeTag(discussionId, index) {
      try {
        const discussionRef = db.collection("discussions").doc(discussionId);
        
        const discussionDoc = await discussionRef.get();
        if (discussionDoc.exists) {
          const discussionData = discussionDoc.data();
          const updatedTags = [...discussionData.tags];
          
          updatedTags.splice(index, 1);

          await discussionRef.update({ tags: updatedTags });

          const discussion = this.filteredDiscussions.find(d => d.id === discussionId);
          if (discussion) {
            discussion.tags = updatedTags;
          }
        }
      } catch (error) {
        console.error("Error removing tag:", error);
      }
    },
    async toggleLike(discussion) {
      if (!this.currentUser) {
        alert("Please log in to like discussions.");
        return;
      }

      const likeRef = db.collection("likes").doc(`${discussion.id}_${this.currentUser.uid}`);
      const likeDoc = await likeRef.get();

      if (likeDoc.exists) {
        // Unlike
        await likeRef.delete();
        discussion.likeCount--;
        discussion.isLiked = false;
      } else {
        // Like
        await likeRef.set({
          discussionId: discussion.id,
          userId: this.currentUser.uid,
          createdAt: new Date()
        });
        discussion.likeCount++;
        discussion.isLiked = true;
      }
    },
  },
};
</script>
