<template>
  <div class="bg-[#1A1A1B] rounded-md mb-4">
    <div class="p-4">
      <h2 class="text-xl font-medium mb-2">{{ discussion.title }} <span v-if="discussion.modified">(modified)</span></h2>
      <div v-if="isEditingDiscussion">
        <textarea v-model="editDiscussionContent" class="w-full p-2 bg-[#272729] text-[#D7DADC] border border-[#343536] rounded"></textarea>
        <button @click="saveDiscussionEdit" class="px-4 py-1 bg-[#D7DADC] text-[#1A1A1B] font-bold rounded">Save</button>
      </div>
      <p v-else class="text-sm mb-4">{{ discussion.content }}</p>
      <button v-if="currentUser?.uid === discussion.author" @click="toggleEditDiscussion" class="text-xs text-[#818384] hover:underline ml-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 inline" viewBox="0 0 20 20" fill="currentColor">
          <path d="M14.79 2.21a1 1 0 00-1.42 0l-9 9a1 1 0 00-.29.59v3a1 1 0 001 1h3a1 1 0 00.59-.29l9-9a1 1 0 000-1.42l-3-3zM13 5.414L15.586 8 14 9.586 11.414 7 13 5.414z" />
        </svg>
        Modify
      </button>
      <p class="text-xs text-[#818384] mt-1">{{ formatTimeAgo(discussion.createdAt) }}</p>

      <!-- Replies Section -->
      <div v-for="reply in replies" :key="reply.id" class="bg-[#1A1A1B] p-4 mb-2 rounded">
        <p class="text-xs text-[#818384] mb-2">
          {{ reply.username }} · {{ formatTimeAgo(reply.createdAt) }}
          <button v-if="currentUser?.uid === reply.author" @click="toggleEditReply(reply.id)" class="text-xs text-[#818384] hover:underline ml-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 inline" viewBox="0 0 20 20" fill="currentColor">
              <path d="M14.79 2.21a1 1 0 00-1.42 0l-9 9a1 1 0 00-.29.59v3a1 1 0 001 1h3a1 1 0 00.59-.29l9-9a1 1 0 000-1.42l-3-3zM13 5.414L15.586 8 14 9.586 11.414 7 13 5.414z" />
            </svg>
            Modify
          </button>
        </p>

        <div v-if="isEditingReply[reply.id]">
          <textarea v-model="editReplyContent[reply.id]" class="w-full p-2 bg-[#272729] text-[#D7DADC] border border-[#343536] rounded"></textarea>
          <button @click="saveReplyEdit(reply.id)" class="px-4 py-1 bg-[#D7DADC] text-[#1A1A1B] font-bold rounded">Save</button>
        </div>
        <p v-else class="text-sm">{{ reply.content }} <span v-if="reply.modified">(modified)</span></p>

        <div class="flex items-center text-xs text-[#818384] mt-2">
          <button @click="toggleLike(reply)" class="flex items-center mr-4 hover:bg-[#272729] px-2 py-1 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1" :class="{ 'text-red-500 fill-current': reply.isLiked }" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
            </svg>
            {{ reply.likeCount }}
          </button>
          <button class="flex items-center mr-4 hover:bg-[#272729] px-2 py-1 rounded">
            Reply
          </button>
          <button class="flex items-center hover:bg-[#272729] px-2 py-1 rounded">
            Share
          </button>
        </div>
        <p @click="showLikeModal('reply', reply.id)" class="text-xs text-[#818384] mt-2 cursor-pointer hover:underline">
          {{ getLikesSummary(reply) }}
        </p>
      </div>
    </div>

    <!-- Reply Form -->
    <form @submit.prevent="postReply" class="mt-4 bg-[#1A1A1B] p-4 rounded">
      <textarea
        v-model="replyContent"
        required
        class="w-full p-2 bg-[#272729] text-[#D7DADC] border border-[#343536] rounded focus:outline-none focus:ring-1 focus:ring-[#D7DADC] resize-none"
        rows="4"
        placeholder="What are your thoughts?"
      ></textarea>
      <div class="flex justify-end mt-2">
        <button
          type="submit"
          class="px-4 py-1 bg-[#D7DADC] text-[#1A1A1B] font-bold rounded-full text-sm hover:bg-white"
        >
          Comment
        </button>
      </div>
    </form>

    <!-- Like Modal -->
    <div v-if="LikeModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-[#1A1A1B] p-4 rounded-md w-80">
        <h3 class="text-lg font-medium mb-2">Liked by:</h3>
        <ul class="max-h-60 overflow-y-auto">
          <li v-for="user in currentLikedUsers" :key="user.id" class="py-2 border-b border-[#343536] last:border-b-0">
            {{ user.name }}
          </li>
        </ul>
        <button @click="closeLikeModal" class="mt-4 px-4 py-2 bg-[#D7DADC] text-[#1A1A1B] rounded-md hover:bg-white">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { db, auth } from "../../firebase";

export default {
  data() {
    return {
      discussion: { likeCount: 0, isLiked: false, likedUsers: [], author: '', createdAt: null, modified: false },
      replies: [],
      replyContent: "",
      LikeModal: false,
      currentUser: null,
      currentLikedUsers: [],
      isEditingDiscussion: false,
      editDiscussionContent: "",
      isEditingReply: {},
      editReplyContent: {},
    };
  },
  async created() {
    try {
      const discussionId = this.$route.params.id;
      this.currentUser = auth.currentUser;

      // Fetch discussion details
      const discussionDoc = await db.collection("discussions").doc(discussionId).get();
      this.discussion = { id: discussionDoc.id, ...discussionDoc.data(), likeCount: 0, isLiked: false, likedUsers: [], modified: false };
      this.editDiscussionContent = this.discussion.content; // Initialize edit content

      // Fetch replies
      const repliesSnapshot = await db
        .collection("replies")
        .where("discussionId", "==", discussionId)
        .orderBy("createdAt", "asc")
        .get();

      this.replies = await Promise.all(repliesSnapshot.docs.map(async (doc) => {
        const reply = { id: doc.id, ...doc.data(), likeCount: 0, isLiked: false, likedUsers: [], modified: false };
        const userSnapshot = await db.collection("users").doc(reply.author).get();
        reply.username = userSnapshot.exists ? userSnapshot.data().name : "Unknown";
        return reply;
      }));

      // Fetch likes for discussion and replies
      await this.fetchLikes();

    } catch (error) {
      console.error("Error fetching discussion or replies:", error);
    }
  },
  methods: {
    async fetchLikes() {
      const discussionId = this.$route.params.id;

      // Fetch likes for the main discussion
      const discussionLikesSnapshot = await db.collection("likes")
        .where("discussionId", "==", discussionId)
        .where("replyId", "==", null)
        .get();
      
      this.discussion.likeCount = discussionLikesSnapshot.size;
      this.discussion.isLiked = discussionLikesSnapshot.docs.some(doc => doc.data().userId === this.currentUser?.uid);
      this.discussion.likedUsers = discussionLikesSnapshot.docs.map(doc => doc.data().userId);

      // Fetch likes for replies
      for (let reply of this.replies) {
        const replyLikesSnapshot = await db.collection("likes")
          .where("replyId", "==", reply.id)
          .get();
        
        reply.likeCount = replyLikesSnapshot.size;
        reply.isLiked = replyLikesSnapshot.docs.some(doc => doc.data().userId === this.currentUser?.uid);
        reply.likedUsers = replyLikesSnapshot.docs.map(doc => doc.data().userId);
      }
    },
    toggleEditDiscussion() {
      this.isEditingDiscussion = !this.isEditingDiscussion;
      if (this.isEditingDiscussion) {
        this.editDiscussionContent = this.discussion.content; // Load current content for editing
      }
    },
    async saveDiscussionEdit() {
      try {
        await db.collection("discussions").doc(this.discussion.id).update({
          content: this.editDiscussionContent,
          modified: true,
        });
        this.discussion.content = this.editDiscussionContent; // Update the displayed content
        this.discussion.modified = true; // Mark as modified
        this.isEditingDiscussion = false; // Exit edit mode
      } catch (error) {
        console.error("Error saving discussion edit:", error);
      }
    },
    toggleEditReply(replyId) {
      this.$set(this.isEditingReply, replyId, !this.isEditingReply[replyId]);
      if (this.isEditingReply[replyId]) {
        this.$set(this.editReplyContent, replyId, this.replies.find(r => r.id === replyId).content); // Load current content for editing
      }
    },
    async saveReplyEdit(replyId) {
      try {
        const reply = this.replies.find(r => r.id === replyId);
        await db.collection("replies").doc(replyId).update({
          content: this.editReplyContent[replyId],
          modified: true,
        });
        reply.content = this.editReplyContent[replyId]; // Update displayed content
        reply.modified = true; // Mark as modified
        this.$set(this.isEditingReply, replyId, false); // Exit edit mode
      } catch (error) {
        console.error("Error saving reply edit:", error);
      }
    },
    async postReply() {
      try {
        const newReply = {
          content: this.replyContent,
          discussionId: this.discussion.id,
          author: this.currentUser.uid,
          createdAt: new Date(), // Ensure this is a regular JS Date
        };
        const docRef = await db.collection("replies").add(newReply);
        this.replies.push({ id: docRef.id, ...newReply, username: this.currentUser.displayName, modified: false });
        this.replyContent = ""; // Clear the input
        await this.fetchLikes(); // Refresh likes
      } catch (error) {
        console.error("Error posting reply:", error);
      }
    },
    toggleLike(reply) {
      const likeData = {
        userId: this.currentUser.uid,
        discussionId: this.discussion.id,
        replyId: reply.id,
      };

      if (reply.isLiked) {
        db.collection("likes").where("userId", "==", this.currentUser.uid)
          .where("discussionId", "==", this.discussion.id)
          .where("replyId", "==", reply.id)
          .get()
          .then(snapshot => {
            snapshot.forEach(doc => doc.ref.delete());
          });
        reply.isLiked = false;
        reply.likeCount--;
      } else {
        db.collection("likes").add(likeData);
        reply.isLiked = true;
        reply.likeCount++;
      }
    },
    showLikeModal(type, id) {
      this.LikeModal = true;
      // Fetch and set liked users based on the type
      this.currentLikedUsers = [];
      db.collection("likes")
        .where(type === 'discussion' ? "discussionId" : "replyId", "==", id)
        .get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            this.currentLikedUsers.push(doc.data().userId); // Store liked user IDs
          });
        });
    },
    closeLikeModal() {
      this.LikeModal = false;
    },
    getLikesSummary(item) {
      if (item.likeCount === 0) return "No likes yet";
      return item.likeCount === 1 ? "1 like" : `${item.likeCount} likes`;
    },
    formatTimeAgo(date) {
      if (!date) return "Date not available"; // Handle null or undefined date
      const timestamp = date instanceof Date ? date : date.toDate ? date.toDate() : null; // Ensure it's a Date object
      if (!timestamp) return "Invalid date"; // Handle case where toDate is not available

      const secondsAgo = Math.floor((new Date() - timestamp) / 1000);
      if (secondsAgo < 60) return `${secondsAgo} seconds ago`;
      if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)} minutes ago`;
      if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)} hours ago`;
      return `${Math.floor(secondsAgo / 86400)} days ago`;
    },
  },
};
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
