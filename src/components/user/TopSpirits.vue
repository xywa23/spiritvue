<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const topSpirits = ref([
  { id: 1, name: 'Whiskey', rating: 5 },
  { id: 2, name: 'Gin', rating: 4 },
  { id: 3, name: 'Rum', rating: 3 }
])
</script>

<template>
  <Card class="w-full">
    <CardHeader>
      <CardTitle>Top 3 Spirits</CardTitle>
    </CardHeader>
    <CardContent>
      <ul class="space-y-2">
        <li v-for="spirit in topSpirits" :key="spirit.id" class="flex items-center justify-between text-sm">
          <span>{{ spirit.name }}</span>
          <span class="text-yellow-500">
            {{ '★'.repeat(spirit.rating) }}{{ '☆'.repeat(5 - spirit.rating) }}
          </span>
        </li>
      </ul>
    </CardContent>
  </Card>
</template>