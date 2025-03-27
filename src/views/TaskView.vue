<script setup lang="ts">
import { h, ref, resolveComponent } from 'vue'
import { getPaginationRowModel } from '@tanstack/vue-table'
import type { TableColumn } from '@nuxt/ui'
import api from '@/api/api'
import { AxiosError } from 'axios'
import { useRouter } from 'vue-router'

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')

type Task = {
  uuid: string
  file_path: string
  state: string
  start_time: string
  term_time: string
  interval: number
}

const data = ref<Task[]>([])
const loading = ref(true)
const globalFilter = ref('') // 新增全域篩選條件

const router = useRouter()

function fetchTasks() {
  loading.value = true
  api.get('/task').then((response: { data: { tasks: Task[] } }) => {
    data.value = response.data.tasks
      .map((task: any) => {
        const termTime = task.term_time ? new Date(task.term_time).getTime() : Date.now()
        const interval = task.state === 'WAITING'
          ? 0 // WAITING 狀態不計算 interval
          : (termTime - new Date(task.start_time).getTime()) / 1000 // 保留小數點
        return {
          uuid: task.uuid,
          file_path: task.file_path,
          state: task.state,
          start_time: new Date(task.start_time).toLocaleString(),
          term_time: task.term_time ? new Date(task.term_time).toLocaleString() : 'N/A',
          interval: interval > 0 ? interval : 0 // 避免負值
        }
      })
      .reverse() // 反轉資料 array
  }).catch((error: AxiosError) => {
    if (error.response) {
      console.error('Server responded with an error:', error.response)
    } else if (error.request) {
      console.error('No response received:', error.request)
    } else {
      console.error('Error setting up request:', error.message)
    }
  }).finally(() => {
    loading.value = false
  })
}

// 初始載入
fetchTasks()

// 定期更新
setInterval(fetchTasks, 1000) // 每 10 秒更新一次

function createSortableHeader(label: string) {
  return ({ column }: any) => {
    const isSorted = column.getIsSorted()

    return h(UButton, {
      color: 'neutral',
      variant: 'ghost',
      label,
      icon: isSorted
        ? isSorted === 'asc'
          ? 'i-lucide-arrow-up-narrow-wide'
          : 'i-lucide-arrow-down-wide-narrow'
        : 'i-lucide-arrow-up-down',
      class: '-mx-2.5',
      onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
    })
  }
}

const columns: TableColumn<Task>[] = [
  {
    accessorKey: 'uuid',
    header: createSortableHeader('UUID'), // 加入排序功能
    cell: ({ row }) => h('button', {
      class: 'text-blue-500 underline',
      onClick: () => router.push(`/task/${row.getValue('uuid')}`)
    }, row.getValue('uuid'))
  },
  {
    accessorKey: 'file_path',
    header: createSortableHeader('File Path'), // 加入排序功能
    cell: ({ row }) => `${row.getValue('file_path')}`
  },
  {
    accessorKey: 'state',
    header: createSortableHeader('State'), // 加入排序功能
    cell: ({ row }) => {
      const color = {
        RUNNING: 'success' as const,
        TERMINATED: 'error' as const,
        CREATED: 'info' as const,
        WAITING: 'warning' as const,
        RUNABLE: 'neutral' as const
      }[row.getValue('state') as string]

      return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () =>
        row.getValue('state')
      )
    }
  },
  {
    accessorKey: 'start_time',
    header: createSortableHeader('Start Time'), // 加入排序功能
    cell: ({ row }) => `${row.getValue('start_time')}`
  },
  {
    accessorKey: 'interval',
    header: createSortableHeader('Interval (s)'), // 加入排序功能
    cell: ({ row }) => `${row.getValue('interval')} s`
  },
  {
    id: 'action'
  }
]

const pagination = ref({
  pageIndex: 0,
  pageSize: 8
})

function handleDelete(task) {

}

function getDropdownActions(file: File): DropdownMenuItem[][] {
  return [
    [
      {
        label: 'Copy file name',
        icon: 'i-lucide-copy',
        onSelect: () => {
          navigator.clipboard.writeText(file.name)
          toast.add({
            title: 'File name copied to clipboard!',
            color: 'success',
            icon: 'i-lucide-circle-check'
          })
        }
      }
    ],
    [
      {
        label: 'Delete',
        icon: 'i-lucide-trash',
        color: 'error',
        onSelect: () => handleDelete(file)
      }
    ]
  ]
}
</script>

<template>
  <div class="flex flex-col flex-1 w-full">
    <div class="flex px-4 py-3.5 border-b border-(--ui-border-accented)">
      <UInput v-model="globalFilter" class="max-w-sm me-2" placeholder="Filter..." />
      <UPagination :default-page="pagination.pageIndex + 1" :items-per-page="pagination.pageSize" :total="data.length"
        @update:page="(p: number) => pagination.pageIndex = p - 1" />
    </div>
    <UTable :loading="loading" v-model:pagination="pagination" v-model:global-filter="globalFilter" :data="data"
      :columns="columns" :pagination-options="{
        getPaginationRowModel: getPaginationRowModel()
      }">
      <template #action-cell="{ row }">
        <UDropdownMenu :items="getDropdownActions(row.original)">
          <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" aria-label="Actions" />
        </UDropdownMenu>
      </template>
    </UTable>
  </div>
</template>

<style scoped></style>
