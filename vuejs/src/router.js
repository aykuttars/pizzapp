import Vue from 'vue'
import Router from 'vue-router'
import TaskList from '@/components/TaskList';
import TaskResult from '@/views/TaskResult';
import Login from '@/views/Login';
import Profile from '@/views/Profile';
import Register from '@/views/Register';
import store from './store';

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'tasks',
      component: TaskList
    },
    {
      path: '/result/:id',
      name: 'result',
      component: TaskResult
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        authNotRequired: true
      }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: {
        authNotRequired: true
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (
    !(to.meta && to.meta.authNotRequired) &&
    (store.state.authentication.user == null)
  ) {
    const path = `/login`
    return next(`${path}?redirectUrl=${to.path}`)
  }
  next()
})

export default router;