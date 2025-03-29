<script setup lang="ts">
</script>

<template>
  <div class="flex flex-row h-full">
    <NavBar class="basis-2/12 h-full p-4" />
    <div class="w-full h-full py-4 p-4">
      <RouterView class="flex flex-col h-full" />
    </div>
  </div>
</template>
