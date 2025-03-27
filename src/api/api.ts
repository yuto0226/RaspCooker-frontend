import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { useSettingStore } from '@/stores/settings'

const api = axios.create()

api.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  const settingStore = useSettingStore()

  // 動態設定 baseURL
  config.baseURL = `http://${settingStore.host}:${settingStore.port}`

  const token = authStore.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      authStore.logout()
    }
    return Promise.reject(error)
  }
)

export default api