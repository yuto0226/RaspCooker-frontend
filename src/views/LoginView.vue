<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import type { FormError, FormErrorEvent, FormSubmitEvent } from '@nuxt/ui'
import { useToast } from '@nuxt/ui/runtime/composables/useToast.js'
import { useAuthStore } from '@/stores/auth'
import { useSettingStore } from '@/stores/settings'
import api from '@/api/api'
import { AxiosError } from 'axios'

const router = useRouter()

const state = reactive({
  account: undefined,
  password: undefined,
  host: '127.0.0.1:5000', // 預設值
})

const validate = (state: { account: string | undefined; password: string | undefined; host: string }): FormError[] => {
  const errors = []
  if (!state.account) errors.push({ name: 'account', message: 'Required' })
  if (!state.password) errors.push({ name: 'password', message: 'Required' })
  if (!state.host) errors.push({ name: 'host', message: 'Required' })
  return errors
}

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Record<string, unknown>>) {
  try {
    const settingStore = useSettingStore()
    settingStore.setServer(state.host.split(':')[0], parseInt(state.host.split(':')[1]))

    const response = await api.post('/auth/login', {
      username: state.account,
      password: state.password,
    })

    const token = response.data.token
    const authStore = useAuthStore()
    authStore.setToken(token)

    toast.add({ title: 'Login success.', color: 'success' })
    state.account = undefined
    state.password = undefined
    state.host = '127.0.0.1:5000' // 重置為預設值
    router.push('/')
  } catch (error) {
    handleError(error as AxiosError)
  }
  console.log(event.data)
}

function handleError(error: AxiosError) {
  if (error.response) {
    const errorMessage = (error.response.data as { message?: string })?.message || 'Unknown error'
    toast.add({ title: 'Login failed', description: errorMessage, color: 'error' })
  } else if (error.request) {
    toast.add({ title: 'Error', description: 'No response from server.', color: 'error' })
  } else {
    toast.add({ title: 'Error', description: error.message, color: 'error' })
  }
}

async function onError(event: FormErrorEvent) {
  if (event?.errors?.[0]?.id) {
    const element = document.getElementById(event.errors[0].id)
    element?.focus()
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}
</script>

<template>
  <div class="container">
    <div class="mx-auto my-auto flex flex-row pb-24">
      <UForm :validate="validate" :state="state" class="space-y-4" @submit="onSubmit" @error="onError">
        <UFormField label="Host" name="host">
          <UInput v-model="state.host" />
        </UFormField>
        
        <UFormField label="Account" name="account">
          <UInput v-model="state.account" />
        </UFormField>

        <UFormField label="Password" name="password">
          <UInput v-model="state.password" type="password" />
        </UFormField>

        <UButton type="submit" loading-auto>
          Submit
        </UButton>
      </UForm>
    </div>
  </div>
</template>
