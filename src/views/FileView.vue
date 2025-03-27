<script setup lang="ts">
import { h, ref, resolveComponent } from 'vue'
import type { DropdownMenuItem, TableColumn } from '@nuxt/ui'
import api from '@/api/api'
import { useToast } from '@nuxt/ui/runtime/composables/useToast.js'

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')

type File = {
  name: string
  size: number
  create_time: string
}

const toast = useToast()
const data = ref<File[]>([])
const loading = ref(true)

function fetchFiles() {
  api
    .get('/file')
    .then((response: any) => {
      data.value = response.data.files.map((file: any) => ({
        name: file.filename,
        size: file.size,
        create_time: new Date(file.created_time * 1000).toLocaleString(),
      }))
    })
    .catch((error: any) => {
      if (error.response) {
        console.error('Server responded with an error:', error.response)
      } else if (error.request) {
        console.error('No response received:', error.request)
      } else {
        console.error('Error setting up request:', error.message)
      }
    })
    .finally(() => {
      loading.value = false
    })
}

// 初始化時載入檔案列表
fetchFiles()

// 每 60 秒更新檔案列表
setInterval(fetchFiles, 60000)

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
      onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
    })
  }
}

const columns: TableColumn<File>[] = [
  {
    accessorKey: 'name',
    header: createSortableHeader('Name'),
    cell: ({ row }) => `${row.getValue('name')}`,
  },
  {
    accessorKey: 'size',
    header: createSortableHeader('Size (bytes)'),
    cell: ({ row }) => `${row.getValue('size')}`,
  },
  {
    accessorKey: 'create_time',
    header: createSortableHeader('Created Time'),
    cell: ({ row }) => `${row.getValue('create_time')}`,
  },
  {
    id: 'action',
  },
]

const globalFilter = ref('')

function handleRun(file: File) {
  console.log(`Running file: ${file.name}`)
  api
    .post(`/task/${file.name}/run`)
    .then(() => {
      toast.add({
        title: `File "${file.name}" is running.`,
        color: 'info',
        icon: 'i-lucide-play',
      })
    })
    .catch((error: any) => {
      console.error(`Failed to run file "${file.name}":`, error)
      toast.add({
        title: `Failed to run file "${file.name}".`,
        color: 'error',
        icon: 'i-lucide-alert-circle',
      })
    })
}

function handleEdit(file: File) {
  console.log(`Editing file: ${file.name}`)
  toast.add({
    title: `File "${file.name}" is being edited.`,
    color: 'warning',
    icon: 'i-lucide-edit',
  })
}

function handleDelete(file: File) {
  console.log(`Deleting file: ${file.name}`)
  api
    .delete(`/file/${file.name}`)
    .then(() => {
      toast.add({
        title: `File "${file.name}" has been deleted.`,
        color: 'error',
        icon: 'i-lucide-trash',
      })
      // 更新檔案列表
      data.value = data.value.filter((f) => f.name !== file.name)
    })
    .catch((error: any) => {
      console.error(`Failed to delete file "${file.name}":`, error)
      toast.add({
        title: `Failed to delete file "${file.name}".`,
        color: 'error',
        icon: 'i-lucide-alert-circle',
      })
    })
  fetchFiles()
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
            icon: 'i-lucide-circle-check',
          })
        },
      },
    ],
    [
      {
        label: 'Run',
        icon: 'i-lucide-play',
        onSelect: () => handleRun(file),
      },
      {
        label: 'Edit',
        icon: 'i-lucide-edit',
        onSelect: () => handleEdit(file),
      },
      {
        label: 'Delete',
        icon: 'i-lucide-trash',
        color: 'error',
        onSelect: () => handleDelete(file),
      },
    ],
  ]
}
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex px-4 py-3.5 border-b border-(--ui-border-accented)">
      <UInput v-model="globalFilter" class="max-w-sm" placeholder="Filter..." />
    </div>
    <UTable
      :loading="loading"
      v-model:global-filter="globalFilter"
      loading-color="primary"
      loading-animation="carousel"
      :data="data"
      :columns="columns"
      class="flex-1"
    >
      <template #action-cell="{ row }">
        <UDropdownMenu :items="getDropdownActions(row.original)">
          <UButton
            icon="i-lucide-ellipsis-vertical"
            color="neutral"
            variant="ghost"
            aria-label="Actions"
          />
        </UDropdownMenu>
      </template>
    </UTable>
  </div>
</template>

<style scoped></style>
