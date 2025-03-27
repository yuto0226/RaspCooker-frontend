<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { NavigationMenuItem } from '@nuxt/ui'
import { useColorMode } from '@vueuse/core'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()

const mode = useColorMode()
const authStore = useAuthStore()

const MainLinks = ref<NavigationMenuItem[][]>([
  [
    {
      label: 'File',
      icon: 'i-lucide-folder',
      to: '/file',
    },
    {
      label: 'Task',
      icon: 'i-lucide-server',
      to: '/task',
    },
    {
      label: 'Shell',
      icon: 'i-lucide-terminal',
      to: '/shell',
    },
    {
      label: 'Settings',
      icon: 'i-lucide-settings',
      to: '/settings',
    },
  ],
])

const handleLogout = () => {
  authStore.logout()
  router.replace('/login')
}

const SubLinks = ref<NavigationMenuItem[][]>([[]])
</script>

<template>
  <div class="flex flex-col h-full">
    <h1 class="mb-4">Rasp Cooker</h1>
    <div class="grow">
      <UNavigationMenu
        orientation="vertical"
        :items="MainLinks"
        class="data-[orientation=vertical]:w-64"
      >
      </UNavigationMenu>
    </div>
    <div class="mt-auto">
      <UButton
        class="w-full"
        :icon="mode === 'dark' ? 'i-lucide-moon' : 'i-lucide-sun'"
        color="neutral"
        variant="ghost"
        @click="mode = mode === 'dark' ? 'light' : 'dark'"
      >
        {{ mode === 'dark' ? 'dark' : 'light' }}
      </UButton>
      <UNavigationMenu
        orientation="vertical"
        :items="SubLinks"
        class="data-[orientation=vertical]:w-64"
      >
      </UNavigationMenu>
      <UButton
        class="w-full"
        icon="i-lucide-log-out"
        color="neutral"
        variant="ghost"
        @click="handleLogout"
      >
        Logout
      </UButton>
    </div>
  </div>
</template>
