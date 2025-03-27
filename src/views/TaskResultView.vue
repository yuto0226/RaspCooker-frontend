<script setup lang="ts">
import { ref, onMounted, resolveComponent } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/api/api'

const UButton = resolveComponent('UButton')

const route = useRoute()
const task = ref({
  uuid: '',
  file_path: '',
  state: '',
  start_time: '',
  term_time: '',
  return_code: '',
  stdout: '',
  stderr: ''
})
const loading = ref(true)

async function fetchTaskDetails(uuid: string) {
  try {
    const response = await api.get(`/task/${uuid}`)
    task.value = response.data
  } catch (error) {
    console.error('Failed to fetch task details:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const uuid = route.params.id as string
  if (uuid) {
    fetchTaskDetails(uuid)
  }
})
</script>

<template>
  <div>
    <div v-if="loading" class="text-center text-lg font-semibold">Loading...</div>
    <div v-else>
      <h3 class="text-2xl mb-4">{{ task.uuid }}</h3>
      <table class="table-auto w-full border-collapse border border-gray-300 dark:border-gray-700 mb-6">
        <tbody>
          <tr>
            <td class="border border-gray-300 dark:border-gray-700 px-4 py-2 font-semibold">File Path</td>
            <td class="border border-gray-300 dark:border-gray-700 px-4 py-2">{{ task.file_path }}</td>
          </tr>
          <tr>
            <td class="border border-gray-300 dark:border-gray-700 px-4 py-2 font-semibold">State</td>
            <td class="border border-gray-300 dark:border-gray-700 px-4 py-2">
              <UBadge
                size="md"
                :color="{
                  RUNNING: 'success',
                  TERMINATED: 'error',
                  CREATED: 'info',
                  WAITING: 'warning',
                  RUNABLE: 'neutral'
                }[task.state] || 'default'"
                variant="subtle"
              >
                {{ task.state }}
              </UBadge>
            </td>
          </tr>
          <tr>
            <td class="border border-gray-300 dark:border-gray-700 px-4 py-2 font-semibold">Start Time</td>
            <td class="border border-gray-300 dark:border-gray-700 px-4 py-2">{{ task.start_time }}</td>
          </tr>
          <tr>
            <td class="border border-gray-300 dark:border-gray-700 px-4 py-2 font-semibold">End Time</td>
            <td class="border border-gray-300 dark:border-gray-700 px-4 py-2">{{ task.term_time }}</td>
          </tr>
          <tr>
            <td class="border border-gray-300 dark:border-gray-700 px-4 py-2 font-semibold">Return Code</td>
            <td class="border border-gray-300 dark:border-gray-700 px-4 py-2">{{ task.return_code }}</td>
          </tr>
        </tbody>
      </table>

      <div class="flex gap-4">
        <div class="w-1/2">
          <strong class="text-lg">Stdout</strong>
          <pre
            class="h-100 p-4 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-sm overflow-auto max-h-96"><code>{{ task.stdout }}</code>
          </pre>
        </div>
        <div class="w-1/2">
          <strong class="text-lg">Stderr</strong>
          <pre
            class="h-100 p-4 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-sm overflow-auto max-h-96"><code>{{ task.stderr }}</code>
          </pre>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
