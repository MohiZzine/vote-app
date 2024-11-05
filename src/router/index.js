import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import LoginPage from '../views/LoginPage.vue';
import Registration from '../views/SignUp.vue';
import UserProfile from '../views/ProfilePage.vue';
import CategoryView from '../views/CategoryPage.vue';
import DiscussionView from '../views/DiscussionPage.vue'; // Ensure this is your detail view
import EditUserProfile from '../components/User/EditProfile.vue';
import NewDiscussion from '../components/Discussion/CreateDiscussion.vue';
import PasswordReset from '../components/Auth/ResetPassword.vue';

// Function to create route configuration
const createRoute = (path, name, component, props = false) => ({
  path,
  name,
  component,
  props,
});

const appRoutes = [
  createRoute('/', 'HomePage', HomePage),
  createRoute('/login', 'LoginPage', LoginPage),
  createRoute('/register', 'Registration', Registration),
  createRoute('/user-profile', 'UserProfile', UserProfile),
  createRoute('/edit-user', 'EditUserProfile', EditUserProfile),
  createRoute('/categories/:tag', 'CategoryView', CategoryView, true),
  createRoute('/all-categories', 'AllCategories', CategoryView, true),
  createRoute('/discussion/:id', 'DiscussionView', DiscussionView), 
  createRoute('/new-discussion', 'NewDiscussion', NewDiscussion),
  createRoute('/password-reset', 'PasswordReset', PasswordReset),
];

// Create a new router instance
const routerInstance = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: appRoutes,
});

// Export the router instance
export default routerInstance;
