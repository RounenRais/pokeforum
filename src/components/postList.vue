<template>

</template>
<script setup>
import {collectio, getDocs} from "firebase/firestore"
const querySnapshot=await getDocs(collection(db,"posts"))
querySnapshot.forEach((doc)=>{
    console.log(doc.id, "=>", doc.data())
})
</script>