import { createRouter, createWebHistory } from 'vue-router';

// Sayfa bileşenlerini import edin
import Home from '../src/views/Home.vue';
import openCase from '../src/views/openCase.vue';
import SignUp from '../src/views/SignUp.vue';
import About from '../src/views/about.vue';
import LogIn from '../src/views/logIn.vue';
import PostDetail from '../src/components/postDetail.vue'
import NewPost from '../src/views/newPost.vue'

import { auth } from '../src/firebase'; // Firebase auth modülünü import edin
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },  
  {
    path: '/openCase',
    name: 'Case',
    component: openCase,
  },  
  {
    path: '/signUp',
    name: 'SignUp',
    component: SignUp,
  },
    {
    path: '/logIn',
    name: 'logIn',
    component: LogIn,
  },
    {
    path: '/about',
    name: 'about',
    component: About,
  },
    { path: '/post/:id',
     name: 'PostDetail',
     component: PostDetail
      },
        { path: '/newPost',
     name: 'newPost',
     component: NewPost
      }

];
// Router'ı oluşturun
const router = createRouter({
  history: createWebHistory(),
  routes,
});router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((rec) => rec.meta.requiresAuth);
  const user = auth.currentUser;

  if (requiresAuth && !user) next('/login');
  else next();
});
export default router;