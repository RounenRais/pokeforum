<template>
  <div v-if="post">
    <h2>{{ post.title }}</h2>
    <p><strong>Yazar:</strong> {{ post.authorName }}</p>
    <p><strong>Tarih:</strong> {{ formatDate(post.createdAt) }}</p>
    <p>{{ post.content }}</p>
  </div>
  <div v-else>
    <p>Yükleniyor...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'

const route = useRoute()
const post = ref(null)

const fetchPost = async () => {
  const postId = route.params.id
  const postRef = doc(db, 'posts', postId)
  const postSnap = await getDoc(postRef)

  if (postSnap.exists()) {
    post.value = postSnap.data()
  } else {
    console.log('Post bulunamadı.')
  }
}

onMounted(() => {
  fetchPost()
})

const formatDate = (timestamp) => {
  if (!timestamp) return ''
  return timestamp.toDate().toLocaleString()
}
</script>
