<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@iconify/vue'
import { supabase } from "@/lib/supabase.ts"

type Game = {
  id: string;
  date: string;
  userId: string;
  spirits: string;
  terrorLevel: number;
  islandState: string;
  result: string;
  fun: number;
  adversary: string;
  scenario: string;
  difficulty: number;
  score: number;
}

const columns = ['date', 'spirits', 'terrorLevel', 'islandState', 'result', 'fun', 'adversary', 'scenario', 'difficulty', 'score'] as const;
type Column = typeof columns[number];

const games = ref<Game[]>([])
const errorMessage = ref('')
const isLoading = ref(false)
const pageSize = 5 // Number of games to fetch per page
const currentPage = ref(1)
const hasMoreGames = ref(true)
const sortColumn = ref('date')
const sortOrder = ref<'asc' | 'desc'>('desc')

const getGameValue = (game: Game, column: Column): string | number => {
  return game[column];
}

const readGames = async () => {
  if (!hasMoreGames.value) return

  isLoading.value = true
  errorMessage.value = ''
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No user logged in')

    const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('userId', user.id)
        .order(sortColumn.value, { ascending: sortOrder.value === 'asc' })
        .range((currentPage.value - 1) * pageSize, currentPage.value * pageSize - 1)

    if (error) throw error
    if (data.length < pageSize) {
      hasMoreGames.value = false
    }
    games.value = [...games.value, ...(data as Game[])]
    console.log('Games fetched:', data)
  } catch (error) {
    console.error('Error fetching games:', error)
    errorMessage.value = error instanceof Error ? error.message : 'Error fetching games'
  } finally {
    isLoading.value = false
  }
}

const loadMoreGames = () => {
  currentPage.value++
  readGames()
}

const sortGames = (column: string) => {
  if (sortColumn.value === column) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = column
    sortOrder.value = 'asc'
  }

  games.value = []
  currentPage.value = 1
  hasMoreGames.value = true
  readGames()
}

const getSortIcon = (column: string) => {
  if (sortColumn.value !== column) return 'mdi:sort'
  return sortOrder.value === 'asc' ? 'mdi:sort-ascending' : 'mdi:sort-descending'
}

onMounted(() => {
  readGames()
})
</script>

<template>
  <Card class="w-full">
    <CardHeader>
      <CardTitle>Spirit Island Game Results</CardTitle>
    </CardHeader>
    <CardContent>
      <div v-if="errorMessage" class="text-red-500 mb-4">{{ errorMessage }}</div>
      <div v-if="isLoading">Loading...</div>
      <Table v-else>
        <TableHeader>
          <TableRow>
            <TableHead v-for="column in columns"
                       :key="column"
                       @click="sortGames(column)"
                       class="cursor-pointer">
              {{ column.charAt(0).toUpperCase() + column.slice(1) }}
              <Icon :icon="getSortIcon(column)" class="inline-block ml-1" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="game in games" :key="game.id">
            <TableCell v-for="column in columns"
                       :key="column"
                       class="py-4">
              <template v-if="column === 'islandState' || column === 'result'">
                <Badge :variant="getGameValue(game, column) === 'Healthy' || getGameValue(game, column) === 'Victory' ? 'default' : 'destructive'" class="gap-1">
                  <Icon
                      :icon="getGameValue(game, column) === 'Healthy' || getGameValue(game, column) === 'Victory' ? 'radix-icons:check' : 'radix-icons:cross-2'"
                      class="w-3 h-3"
                  />
                  {{ getGameValue(game, column) }}
                </Badge>
              </template>
              <template v-else-if="column === 'fun' || column === 'difficulty'">
                {{ getGameValue(game, column) }}/10
              </template>
              <template v-else>
                {{ getGameValue(game, column) }}
              </template>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Button variant="outline" @click="loadMoreGames" :disabled="isLoading || !hasMoreGames" class="mt-4">
        {{ isLoading ? 'Loading...' : hasMoreGames ? 'Load More Games' : 'No More Games' }}
      </Button>
    </CardContent>
  </Card>
</template>