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
    <div class="w-[calc(50%-0.5rem)] flex flex-col">
      <div class="flex-grow">
        <UserInfo :identifier="identifier" />
      </div>
      <div class="mt-4 flex-grow">
        <TopSpirits :identifier="identifier" />
      </div>
    </div>

    <div class="w-[calc(50%-0.5rem)] flex">
      <Achievements :identifier="identifier" class="flex-grow" />
    </div>

    <div class="w-full">
      <UserGames :identifier="identifier" />
    </div>
  </div>
</template>

<style scoped>
.flex-grow {
  flex-grow: 1;
  min-height: 0;
}
</style>