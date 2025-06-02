<template>
  <div class="home">
    <h2>Forum Konuları</h2>

    <div v-for="post in posts" :key="post.id" class="post-card">
      <RouterLink :to="`/post/${post.id}`">
        <h3>{{ post.title }}</h3>
      </RouterLink>
      <p>Yazan: {{ post.authorName }}</p>
      <p>Tarih: {{ formatDate(post.createdAt) }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
const posts = ref([]) 
const fetchPosts = async () => {
  const snapshot = await getDocs(collection(db, 'posts'))
  posts.value = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}
onMounted(() => {
  fetchPosts()
})
const formatDate = (date) => {
  if (!date) return ''
  const d = date.toDate()
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString()
}
</script>
