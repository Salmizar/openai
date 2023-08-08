import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/chat',
    name: 'Chat',
    component: () => import(/* webpackChunkName: "chat" */ '../views/ChatView.vue')
  },
  {
    path: '/readdocument',
    name: 'ReadDocument',
    component: () => import(/* webpackChunkName: "readfile" */ '../views/ReadDocument.vue')
  },
  {
    path: '/writecode',
    name: 'WriteCode',
    component: () => import(/* webpackChunkName: "writecode" */ '../views/WriteCode.vue')
  },
  {
    path: '/trivia',
    name: 'Trivia',
    component: () => import(/* webpackChunkName: "trivia" */ '../views/TriviaView.vue')
  }
]
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
export default router