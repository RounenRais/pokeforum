<template>
  <div class="new-post">
    <h2>Yeni Konu Aç</h2>
    <input v-model="title" placeholder="Konu Başlığı" />
    <textarea v-model="content" placeholder="İçeriği yazın..." rows="5"></textarea>
    <button @click="submitPost">Gönder</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '../firebase/useAuth'
import { db } from '../firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

const { user } = useAuth() // Kullanıcı bilgisine eriş

const title = ref('')
const content = ref('')

const submitPost = async () => {
  if (!user.value) {
    alert("Konu açmak için giriş yapmalısınız.")
    return
  }

  if (title.value.trim() === '' || content.value.trim() === '') {
    alert("Başlık ve içerik boş olamaz.")
    return
  }

  try {
    await addDoc(collection(db, 'posts'), {
      title: title.value,
      content: content.value,
      authorId: user.value.uid,
      authorName: user.value.displayName || 'Anonim',
      createdAt: serverTimestamp()
    })

    // Formu sıfırla
    title.value = ''
    content.value = ''
    alert("Konu başarıyla oluşturuldu!")
  } catch (err) {
    console.error("Post gönderme hatası:", err)
  }
}
</script>
