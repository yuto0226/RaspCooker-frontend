import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import ui from '@nuxt/ui/vue-plugin'
import { useAuthStore } from '@/stores/auth'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ui)

const authStore = useAuthStore()
if (!authStore.token) {
  router.push('/login')
}

app.mount('#app')
