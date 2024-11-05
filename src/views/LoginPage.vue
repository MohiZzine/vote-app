<template>
  <div>
    <Navbar />
    <Login />
  </div>
</template>

<script>
import Navbar from '../components/Layout/NavBar.vue';
import Login from '../components/Auth/LoginPage.vue';

export default {
  components: { Navbar, Login }
};
</script>
