<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Icon } from '@iconify/vue'

const achievements = ref([
  { id: 1, title: 'Design Champion', description: 'Won the annual design competition', icon: 'mdi:trophy' },
  { id: 2, title: 'Coffee Connoisseur', description: 'Visited 100 unique coffee shops', icon: 'mdi:coffee' },
  { id: 3, title: 'Globe Trotter', description: 'Traveled to 20 countries', icon: 'mdi:earth' }
])
</script>

<template>
  <Card class="w-full">
    <CardHeader>
      <CardTitle>Achievements</CardTitle>
    </CardHeader>
    <CardContent>
      <div class="flex justify-around">
        <div v-for="achievement in achievements" :key="achievement.id" class="text-center">
          <Icon :icon="achievement.icon" class="h-12 w-12 mx-auto mb-2" />
          <strong class="text-sm block">{{ achievement.title }}</strong>
          <p class="text-xs text-gray-500 dark:text-gray-400">{{ achievement.description }}</p>
        </div>
      </div>
    </CardContent>
  </Card>
</template>