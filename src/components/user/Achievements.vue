<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const achievements = ref([
  { id: 1, title: 'Design Champion', description: 'Won the annual design competition' },
  { id: 2, title: 'Coffee Connoisseur', description: 'Visited 100 unique coffee shops' },
  { id: 3, title: 'Globe Trotter', description: 'Traveled to 20 countries' }
])
</script>

<template>
  <Card class="w-full">
    <CardHeader>
      <CardTitle>Achievements</CardTitle>
    </CardHeader>
    <CardContent>
      <ul class="space-y-2">
        <li v-for="achievement in achievements" :key="achievement.id" class="text-sm">
          <strong>{{ achievement.title }}</strong>
          <p class="text-gray-500 dark:text-gray-400">{{ achievement.description }}</p>
        </li>
      </ul>
    </CardContent>
  </Card>
</template>