import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/',
      name: 'admin',
      component: () => import('../views/DashboardView.vue'),
      children: [
        {
          path: '/file',
          name: 'file',
          component: () => import('../views/FileView.vue'),
        },
        {
          path: '/task',
          name: 'task',
          component: () => import('../views/TaskView.vue'),
        },
        {
          path: '/task/:id',
          name: 'task_result',
          component: () => import('../views/TaskResultView.vue'),
        },
        {
          path: '/shell',
          name: 'shell',
          component: () => import('../views/ShellView.vue'),
        },
        {
          path: '/settings',
          name: 'settings',
          component: () => import('../views/SettingsView.vue'),
        },
      ],
    },
  ],
})

export default router
