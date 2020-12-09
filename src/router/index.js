import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Store from '../store/index';
import UserService from '../services/UserService';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/logout',
    name: 'Logout',
    component: () => import('../views/Logout.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue')
  },
  {
    path: '/editor/:projectId',
    name: 'Editor',
    component: () => import('../views/Editor.vue')
  },
  {
    path: '/preview/:projectId',
    name: 'Preview',
    component: () => import('../views/Preview.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {

  let userService = new UserService(Store);

  let isLogged = userService.getUser() !== null && userService.getUser().username !== undefined;
  let isToHome = to.name === 'Home';

  if(!isLogged) {
    if(isToHome) {
      next();
    } else {
      router.push('');
    }
  } else {
    if(isToHome) {
      router.push('Dashboard');
    } else {
      next();
    }
  }
})


export default router
