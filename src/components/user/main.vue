<script setup lang="ts">
import UserInfo from "@/components/user/UserInfo.vue"
import Achievements from "@/components/user/Achievements.vue"
import TopSpirits from "@/components/user/TopSpirits.vue"
import UserGames from "@/components/user/UserGames.vue";

</script>

<template>
  <div class="flex flex-wrap gap-4">
    <div class="w-[calc(50%-0.5rem)]">
      <UserInfo />
    </div>

    <div class="w-[calc(50%-0.5rem)] flex flex-col gap-4">
      <Achievements />
      <TopSpirits />
    </div>

    <div class="w-full">
      <UserGames />
    </div>
  </div>
</template>