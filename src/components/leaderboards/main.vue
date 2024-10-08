<script setup lang="ts">
import TopGames from "@/components/leaderboards/TopGames.vue";
import TopUsers from "@/components/leaderboards/TopUsers.vue";
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TopGames />
      <TopUsers />
    </div>
  </div>
</template>