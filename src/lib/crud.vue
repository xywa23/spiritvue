<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// Define the Game type based on your table structure
type Game = {
  id: string;
  date: string;
  userId: string;
  numPlayers: number;
  adversary: string;
  adversaryDifficulty: number;
  board: string;
  terrorLevel: number;
  fun: number;
  islandState: string;
  scenario: string;
  blightOnIsland: number;
  cardsNotInDeck: number;
  cardsRemainingInDeck: number;
  difficulty: number;
  remainingDahan: number;
  score: number;
  createdAt?: string;
  updatedAt?: string;
}

const games = ref<Game[]>([])
const errorMessage = ref('')
const isLoading = ref(false)

// Form data
const newGame = ref<Omit<Game, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>({
  date: new Date().toISOString().split('T')[0],
  numPlayers: 1,
  adversary: '',
  adversaryDifficulty: 0,
  board: '',
  terrorLevel: 0,
  fun: 0,
  islandState: '',
  scenario: '',
  blightOnIsland: 0,
  cardsNotInDeck: 0,
  cardsRemainingInDeck: 0,
  difficulty: 0,
  remainingDahan: 0,
  score: 0
})

// Create a new game
const createGame = async (gameData: Omit<Game, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No user logged in')

    const { data, error } = await supabase
        .from('games')
        .insert([{ ...gameData, userId: user.id }])
        .select()

    if (error) throw error
    console.log('Game created:', data)
    await readGames()  // Refresh the games list
    return data
  } catch (error) {
    console.error('Error creating game:', error)
    errorMessage.value = error instanceof Error ? error.message : 'Error creating game'
  } finally {
    isLoading.value = false
  }
}

// Handle form submission
const handleSubmit = async (event: Event) => {
  event.preventDefault()
  await createGame(newGame.value)
  // Reset form after submission
  newGame.value = {
    date: new Date().toISOString().split('T')[0],
    numPlayers: 1,
    adversary: '',
    adversaryDifficulty: 0,
    board: '',
    terrorLevel: 0,
    fun: 0,
    islandState: '',
    scenario: '',
    blightOnIsland: 0,
    cardsNotInDeck: 0,
    cardsRemainingInDeck: 0,
    difficulty: 0,
    remainingDahan: 0,
    score: 0
  }
}

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
        .order('createdAt', { ascending: false })

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

// Update a game
const updateGame = async (id: string, updatedData: Partial<Game>) => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No user logged in')

    const { data, error } = await supabase
        .from('games')
        .update(updatedData)
        .eq('id', id)
        .eq('userId', user.id)
        .select()

    if (error) throw error
    console.log('Game updated:', data)
    await readGames()  // Refresh the games list
    return data
  } catch (error) {
    console.error('Error updating game:', error)
    errorMessage.value = error instanceof Error ? error.message : 'Error updating game'
  } finally {
    isLoading.value = false
  }
}

// Delete a game
const deleteGame = async (id: string) => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No user logged in')

    const { error } = await supabase
        .from('games')
        .delete()
        .eq('id', id)
        .eq('userId', user.id)

    if (error) throw error
    console.log('Game deleted:', id)
    await readGames()  // Refresh the games list
    return true
  } catch (error) {
    console.error('Error deleting game:', error)
    errorMessage.value = error instanceof Error ? error.message : 'Error deleting game'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  readGames()
})
</script>

<template>
  <div class="flex justify-center items-center bg-background">
    <Card class="w-[600px]">
      <CardHeader>
        <CardTitle>Games CRUD Operations</CardTitle>
      </CardHeader>
      <CardContent>
        <div v-if="errorMessage" class="text-red-500 mb-4">{{ errorMessage }}</div>

        <!-- Add game form -->
        <form @submit="handleSubmit" class="mb-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <Label for="date">Date</Label>
              <Input id="date" v-model="newGame.date" type="date" required />
            </div>
            <div>
              <Label for="numPlayers">Number of Players</Label>
              <Input id="numPlayers" v-model="newGame.numPlayers" type="number" required />
            </div>
            <!-- Add more form fields for other game properties -->
          </div>
          <Button type="submit" class="mt-4" :disabled="isLoading">
            {{ isLoading ? 'Creating...' : 'Create Game' }}
          </Button>
        </form>

        <!-- Games list -->
        <div v-if="isLoading">Loading...</div>
        <ul v-else>
          <li v-for="game in games" :key="game.id" class="mb-4">
            <div>Date: {{ game.date }}</div>
            <div>Players: {{ game.numPlayers }}</div>
            <!-- Display other game details -->
            <Button @click="deleteGame(game.id)" variant="destructive" size="sm" class="mt-2">Delete</Button>
          </li>
        </ul>
      </CardContent>
    </Card>
  </div>
</template>