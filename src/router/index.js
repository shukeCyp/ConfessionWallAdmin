import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../components/layout/Layout.vue'
import Login from '../components/Login.vue'

const routes = [
  {
    path: '/login',
    component: Login
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('../views/dashboard/index.vue'),
        name: 'Dashboard',
        meta: { title: '首页' }
      },
      {
        path: 'users',
        component: () => import('../views/users/index.vue'),
        name: 'Users',
        meta: { title: '用户管理' }
      },
      {
        path: 'posts',
        name: 'Posts',
        meta: { title: '帖子管理' },
        redirect: '/posts/list',
        children: [
          {
            path: 'list',
            component: () => import('../views/posts/list.vue'),
            name: 'PostsList',
            meta: { title: '全部帖子' }
          },
          {
            path: 'review',
            component: () => import('../views/posts/review.vue'),
            name: 'PostsReview',
            meta: { title: '帖子审核' }
          }
        ]
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 