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
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('../views/ForgotPassword.vue')
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('../views/ResetPassword.vue')
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
  },
  {
    path: '/preview/:projectId/version/:versionNumber',
    name: 'VersionPreview',
    component: () => import('../views/VersionPreview.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {

  let userService = new UserService(Store);

  let DMZRoutes = ['Home', 'ForgotPassword', 'ResetPassword', 'Register'];

  let isLogged = userService.getUser() !== null && userService.getUser().username !== undefined;
  let isToDMZ = DMZRoutes.includes(to.name);

  if(!isLogged) {
    if(isToDMZ) {
      next();
    } else {
      router.push('');
    }
  } else {
    if(isToDMZ) {
      router.push('Dashboard');
    } else {
      next();
    }
  }
})


export default router
