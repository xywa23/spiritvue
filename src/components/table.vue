<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from "@/lib/supabase"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@iconify/vue'

// Define the Game type based on your table structure
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

const games = ref<Game[]>([])
const errorMessage = ref('')
const isLoading = ref(false)

// Read all games for the current user
const readGames = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No user logged in')

    const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('userId', user.id)
        .order('date', { ascending: false })

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
  <div>
    <div v-if="errorMessage" class="text-red-500 mb-4">{{ errorMessage }}</div>
    <div v-if="isLoading">Loading...</div>
    <Table v-else>
      <TableCaption>Spirit Island Game Results</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Spirits</TableHead>
          <TableHead>Terror Level</TableHead>
          <TableHead>Island State</TableHead>
          <TableHead>Result</TableHead>
          <TableHead>Fun</TableHead>
          <TableHead>Adversary</TableHead>
          <TableHead>Scenario</TableHead>
          <TableHead>Difficulty</TableHead>
          <TableHead>Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="game in games" :key="game.id">
          <TableCell class="py-4">{{ game.date }}</TableCell>
          <TableCell class="py-4">{{ game.spirits }}</TableCell>
          <TableCell class="py-4">{{ game.terrorLevel }}</TableCell>
          <TableCell>
            <Badge :variant="game.islandState === 'Healthy' ? 'default' : 'destructive'" class="gap-1">
              <Icon
                  :icon="game.islandState === 'Healthy' ? 'radix-icons:check' : 'radix-icons:cross-2'"
                  class="w-3 h-3"
              />
              {{ game.islandState }}
            </Badge>
          </TableCell>
          <TableCell>
            <Badge :variant="game.result === 'Victory' ? 'default' : 'destructive'" class="gap-1">
              <Icon
                  :icon="game.result === 'Victory' ? 'radix-icons:check' : 'radix-icons:cross-2'"
                  class="w-3 h-3"
              />
              {{ game.result }}
            </Badge>
          </TableCell>
          <TableCell class="py-4">{{ game.fun }}/10</TableCell>
          <TableCell class="py-4">{{ game.adversary }}</TableCell>
          <TableCell class="py-4">{{ game.scenario }}</TableCell>
          <TableCell class="py-4">{{ game.difficulty }}/10</TableCell>
          <TableCell class="py-4">{{ game.score }}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>