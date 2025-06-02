<template>
    <div class="signUp">
        <h2>Sign Up</h2>
        <input v-model="email" type="email" placeholder="Email">
        <input v-model="name" type="text"   placeholder="username">
        <input v-model="password" type="password"  placeholder="Password">
        <input v-model="confirmPassword" type="password" placeholder="Confirm Password">
        <button @click="signUp">Sign Up</button>
    </div>
</template>
<script setup>
import {ref} from 'vue'
import { doc, setDoc } from 'firebase/firestore';
import {useRouter} from "vue-router"
import { auth ,db} from '../firebase'; 
import {createUserWithEmailAndPassword,updateProfile} from 'firebase/auth'
const email=ref('')
const password=ref('')
const confirmPassword=ref('')
const name=ref('')
const router=useRouter()
const signUp = async()=>
{
    try{
        if(confirmPassword.value==password.value){
    const userCredential=await createUserWithEmailAndPassword(auth,email.value,password.value)

    const user=userCredential.user
        await updateProfile(user, {
  displayName: name.value,
});
await setDoc(doc(db,`users`,user.uid),{
    name:name.value,
    email:email.value
})
    email.value=""
    password.value=""
    confirmPassword.value=""
    name.value=""
    router.push("/")
        }
    }
    catch(error){
    console.log('Error',error)
    }
  
}
</script>