<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
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

const columns = ['rank', 'userId', 'spirits', 'adversary', 'result', 'score'] as const;
type Column = typeof columns[number];

const games = ref<Game[]>([])
const errorMessage = ref('')
const isLoading = ref(false)

const rankedGames = computed(() => {
  return games.value.map((game, index) => ({
    ...game,
    rank: index + 1
  }));
});

const getGameValue = (game: Game & { rank: number }, column: Column): string | number => {
  if (column === 'rank') {
    return game.rank;
  }
  if (column === 'userId') {
    return truncateUserId(game.userId);
  }
  return game[column];
}

const truncateUserId = (userId: string): string => {
  if (userId.length <= 8) return userId;
  return `${userId.slice(0, 4)}...${userId.slice(-4)}`;
}

const getWeekStart = (): Date => {
  const now = new Date();
  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
  weekStart.setHours(22, 0, 0, 0); // Set to 10 PM

  // If current time is before Sunday 10 PM, adjust to previous week
  if (now.getDay() === 0 && now.getHours() < 22) {
    weekStart.setDate(weekStart.getDate() - 7);
  }

  return weekStart;
}

const readGames = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No user logged in')

    const weekStart = getWeekStart();

    const { data, error } = await supabase
        .from('games')
        .select('*')
        .gte('date', weekStart.toISOString())
        .order('score', { ascending: false })
        .limit(10)

    if (error) throw error
    games.value = data as Game[]
    console.log('Games fetched:', data)
  } catch (error) {
    console.error('Error fetching games:', error)
    errorMessage.value = error instanceof Error ? error.message : 'Error fetching games'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  readGames()
})
</script>

<template>
  <Card class="w-full">
    <CardHeader>
      <CardTitle class="flex items-center gap-2">
        <Icon icon="mdi:trophy" class="w-6 h-6 text-yellow-500" />
        Top 10 Games This Week
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div v-if="errorMessage" class="text-red-500 mb-4">{{ errorMessage }}</div>
      <div v-if="isLoading">Loading...</div>
      <Table v-else>
        <TableHeader>
          <TableRow>
            <TableHead v-for="column in columns" :key="column">
              {{ column === 'rank' ? '#' : column.charAt(0).toUpperCase() + column.slice(1) }}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="game in rankedGames" :key="game.id">
            <TableCell v-for="column in columns"
                       :key="column"
                       class="py-4">
              <template v-if="column === 'result'">
                <Badge :variant="getGameValue(game, column) === 'Victory' ? 'default' : 'destructive'" class="gap-1">
                  <Icon
                      :icon="getGameValue(game, column) === 'Victory' ? 'radix-icons:check' : 'radix-icons:cross-2'"
                      class="w-3 h-3"
                  />
                  {{ getGameValue(game, column) }}
                </Badge>
              </template>
              <template v-else>
                {{ getGameValue(game, column) }}
              </template>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  </Card>
</template>