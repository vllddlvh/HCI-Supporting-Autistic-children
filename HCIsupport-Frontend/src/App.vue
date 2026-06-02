<template>
  <div :class="store.theme ? 'theme-' + store.theme : 'theme-default'" class="min-h-screen">
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import { useProgressStore } from './stores/progress'

const store = useProgressStore()
</script>