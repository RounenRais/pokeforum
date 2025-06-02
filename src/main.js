import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from '../router'

createApp(App)
  .use(router) // router'i uygulamaya dahil ettik
  .mount('#app')