<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from "@/Header.vue";
</script>

<template>
  <div class="app">
    <Header />  <!-- Use the Header component here -->
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app {
  /* Add any app-wide styles here */
}

main {
  padding: 1rem;
}
</style>