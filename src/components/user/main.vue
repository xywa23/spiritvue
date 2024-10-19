<script setup lang="ts">
import UserInfo from "@/components/user/UserInfo.vue"
import Achievements from "@/components/user/Achievements.vue"
import TopSpirits from "@/components/user/TopSpirits.vue"
import UserGames from "@/components/user/UserGames.vue";

// Accept the identifier prop from the router
const props = defineProps<{
  identifier: string
}>()
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <div class="w-[calc(50%-0.5rem)] flex flex-col gap-4">
      <UserInfo :identifier="identifier" />
      <TopSpirits :identifier="identifier" />
    </div>

    <div class="w-[calc(50%-0.5rem)] flex flex-col gap-4">
      <Achievements :identifier="identifier" />
    </div>

    <div class="w-full">
      <UserGames :identifier="identifier" />
    </div>
  </div>
</template>