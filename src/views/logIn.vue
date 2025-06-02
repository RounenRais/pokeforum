<template>
  <div class="signUp">
    <h2>Sign In</h2>
    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />
    <button @click="signIn">Sign In</button>
  </div>
</template>

<script>
import { auth } from '../firebase';

import {
  signInWithEmailAndPassword,
  onAuthStateChanged
} from 'firebase/auth';

export default {
  data() {
    return {
      email: '',
      password: ''
    };
  },
  created() {
    onAuthStateChanged(auth, (currentUser) => {
      console.log('Oturum açmış kullanıcı:', currentUser?.email);
    });
  },
  methods: {
    async signIn() {
      if (!this.email || !this.password) {
        alert('Email and Password cannot be empty!');
        return;
      }

      try {
        const result = await signInWithEmailAndPassword(auth, this.email, this.password);

        this.email = '';
        this.password = '';
        this.$router.push('/'); // Redirect to home after sign up
      } catch (error) {
        alert(`Hata: ${error.message}`);
        console.error('SignIn Error:', error);
      }
    }
  }
};
</script>
