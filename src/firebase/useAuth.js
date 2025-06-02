// firebase/useAuth.js
import { ref } from 'vue';
import { auth } from './index';
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';

const user = ref(null);
const authReady = ref(false); // ✅ Eklendi

let initialized = false;

if (!initialized) {
  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser;
    authReady.value = true; // ✅ Artık auth durumu geldi
  });
  initialized = true;
}

export function useAuth() {
  return {
    user,
    authReady,
    signOut: () => signOut(auth),
    signIn: (email, pass) => signInWithEmailAndPassword(auth, email, pass),
    signUp: (email, pass) => createUserWithEmailAndPassword(auth, email, pass),
    loginWithGoogle: () => signInWithPopup(auth, new GoogleAuthProvider())
  };
}
