<script setup>
import { useAuth } from '../firebase/useAuth';
import { useRouter } from 'vue-router';

const router = useRouter();
const { user, signOut, authReady } = useAuth();

const logOut = async () => {
  try {
    await signOut();
    router.push('/logIn');
  } catch (error) {
    console.error('Error signing out:', error);
  }
};
</script>

<template>
  <nav class="navbar">
    <RouterLink class="navLink" to="/">Home</RouterLink>
    <RouterLink class="navLink" to="/about">About</RouterLink>
    <RouterLink class="navLink" to="/newPost">New Post</RouterLink>

    <!-- Bekleme ekranı yerine hiçbir şey gösterme -->
    <template v-if="authReady">
      <RouterLink v-if="!user" class="navLink" to="/logIn">Log In</RouterLink>
      <RouterLink v-if="!user" class="navLink" to="/signUp">Sign Up</RouterLink>
      <button v-if="user" @click="logOut" class="navLink">Sign Out</button>
    </template>
  </nav>
</template>
