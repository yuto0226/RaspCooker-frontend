<script setup lang="ts">
import { h, ref, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import api from '@/api/api'

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')

type File = {
  name: string
  size: number
  create_time: string
}

const data = ref<File[]>([])
const loading = ref(true)

api.get('/file').then((response: any) => {
  data.value = response.data.files.map((file: any) => ({
    name: file.filename,
    size: file.size,
    create_time: new Date(file.created_time * 1000).toLocaleString(),
  }))
}).catch((error: any) => {
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

const columns: TableColumn<File>[] = [
  {
    accessorKey: 'name',
    header: createSortableHeader('Name'),
    cell: ({ row }) => `${row.getValue('name')}`
  },
  {
    accessorKey: 'size',
    header: createSortableHeader('Size (bytes)'),
    cell: ({ row }) => `${row.getValue('size')}`
  },
  {
    accessorKey: 'create_time',
    header: createSortableHeader('Created Time'),
    cell: ({ row }) => `${row.getValue('create_time')}`
  },
]

const globalFilter = ref('')
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex px-4 py-3.5 border-b border-(--ui-border-accented)">
      <UInput v-model="globalFilter" class="max-w-sm" placeholder="Filter..." />
    </div>
    <UTable :loading="loading" v-model:global-filter="globalFilter" loading-color="primary" loading-animation="carousel"
      :data="data" :columns="columns" class="flex-1" />
  </div>
</template>

<style scoped></style>
