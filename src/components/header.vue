<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useColorMode } from '@vueuse/core'
import { Icon } from '@iconify/vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import {supabase} from "@/lib/supabase.ts";
import {Session} from "@supabase/supabase-js";

const props = defineProps<{
  session?: Session | null
}>()

const router = useRouter()
const mode = useColorMode()
const isModalOpen = ref(false)
const errorMessage = ref('')

const openModal = () => {
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

// Form state
const newGame = ref({
  date: new Date().toISOString().split('T')[0],
  numPlayers: 1,
  spirits: [],
  adversary: '',
  adversaryDifficulty: 0,
  scenario: '',
  board: [],
  result: '',
  terrorLevel: 1,
  islandState: '',
  fun: 1,
  blightOnIsland: 1,
  cardsNotInDeck: 0,
  cardsRemainingInDeck: 0,
  difficulty: 0,
  remainingDahan: 1,
  score: 0
})

// Define the Game interface
interface Game {
  userId: string;
  date: string;
  numPlayers: number;
  spirits: string[];
  adversary: string;
  adversaryDifficulty: number;
  scenario: string;
  board: string[];
  result: 'Victory' | 'Defeat';
  terrorLevel: number;
  islandState: string;
  fun: number;
  blightOnIsland: number;
  cardsNotInDeck: number;
  cardsRemainingInDeck: number;
  difficulty: number;
  remainingDahan: number;
  score: number;
}

type AchievementCondition = ((games: Game[]) => boolean) | ((games: Game[], game: Game) => boolean);

const achievements: Array<{
  id: string;
  title: string;
  condition: AchievementCondition;
}> = [
  { id: '1', title: 'First Step', condition: (games: Game[]) => games.length === 1 },
  { id: '2', title: 'Getting Started', condition: (games: Game[]) => games.length === 5 },
  { id: '3', title: 'Regular Player', condition: (games: Game[]) => games.length === 25 },
  { id: '4', title: 'Dedicated Gamer', condition: (games: Game[]) => games.length === 50 },
  { id: '5', title: 'Century Club', condition: (games: Game[]) => games.length === 100 },
  { id: '6', title: 'Prussian Victory', condition: (_: Game[], game: Game) => game.adversary === 'Brandenburg-Prussia' && game.result === 'Victory' },
  { id: '7', title: 'English Conquest', condition: (_: Game[], game: Game) => game.adversary === 'England' && game.result === 'Victory' },
  { id: '8', title: 'Swedish Triumph', condition: (_: Game[], game: Game) => game.adversary === 'Sweden' && game.result === 'Victory' },
  { id: '9', title: 'French Colonial Victory', condition: (_: Game[], game: Game) => game.adversary === 'France (Plantation Colony)' && game.result === 'Victory' },
  { id: '10', title: 'Habsburg Livestock Defeat', condition: (_: Game[], game: Game) => game.adversary === 'Habsburg Monarchy (Livestock Colony)' && game.result === 'Victory' },
  { id: '11', title: 'Russian Conquest', condition: (_: Game[], game: Game) => game.adversary === 'Russia' && game.result === 'Victory' },
  { id: '12', title: 'Scottish Victory', condition: (_: Game[], game: Game) => game.adversary === 'Scotland' && game.result === 'Victory' },
  { id: '13', title: 'Habsburg Mining Triumph', condition: (_: Game[], game: Game) => game.adversary === 'Habsburg Mining Expedition' && game.result === 'Victory' },
  { id: '14', title: 'Prussian Mastery', condition: (_: Game[], game: Game) => game.adversary === 'Brandenburg-Prussia' && game.adversaryDifficulty === 6 && game.result === 'Victory' },
  { id: '15', title: 'English Domination', condition: (_: Game[], game: Game) => game.adversary === 'England' && game.adversaryDifficulty === 6 && game.result === 'Victory' },
  { id: '16', title: 'Swedish Supremacy', condition: (_: Game[], game: Game) => game.adversary === 'Sweden' && game.adversaryDifficulty === 6 && game.result === 'Victory' },
  { id: '17', title: 'French Colonial Mastery', condition: (_: Game[], game: Game) => game.adversary === 'France (Plantation Colony)' && game.adversaryDifficulty === 6 && game.result === 'Victory' },
  { id: '18', title: 'Habsburg Livestock Mastery', condition: (_: Game[], game: Game) => game.adversary === 'Habsburg Monarchy (Livestock Colony)' && game.adversaryDifficulty === 6 && game.result === 'Victory' },
  { id: '19', title: 'Russian Domination', condition: (_: Game[], game: Game) => game.adversary === 'Russia' && game.adversaryDifficulty === 6 && game.result === 'Victory' },
  { id: '20', title: 'Scottish Supremacy', condition: (_: Game[], game: Game) => game.adversary === 'Scotland' && game.adversaryDifficulty === 6 && game.result === 'Victory' },
  { id: '21', title: 'Habsburg Mining Mastery', condition: (_: Game[], game: Game) => game.adversary === 'Habsburg Mining Expedition' && game.adversaryDifficulty === 6 && game.result === 'Victory' },
  { id: '22', title: 'Base Game Master', condition: (games: Game[]) => new Set(games.flatMap(g => g.spirits)).size >= 4 },
  { id: '23', title: 'Branch & Claw Explorer', condition: (games: Game[]) => new Set(games.flatMap(g => g.spirits)).size >= 6 },
  { id: '24', title: 'Jagged Earth Conqueror', condition: (games: Game[]) => new Set(games.flatMap(g => g.spirits)).size >= 16 },
  { id: '25', title: 'Promo Pack II Enthusiast', condition: (games: Game[]) => new Set(games.flatMap(g => g.spirits)).size >= 18 },
  { id: '26', title: 'Horizons Adventurer', condition: (games: Game[]) => new Set(games.flatMap(g => g.spirits)).size >= 23 },
  { id: '27', title: 'Nature Incarnate Channeler', condition: (games: Game[]) => new Set(games.flatMap(g => g.spirits)).size >= 28 },
  { id: '28', title: 'Spirit Island Completionist', condition: (games: Game[]) => new Set(games.flatMap(g => g.spirits)).size >= 33 },
  { id: '29', title: 'High Scorer', condition: (games: Game[]) => Math.max(...games.map(g => g.score)) >= 100 },
  { id: '30', title: 'Difficulty Master', condition: (games: Game[]) => Math.max(...games.map(g => g.difficulty)) >= 10 },
  { id: '31', title: 'Blight Controller', condition: (_: Game[], game: Game) => game.blightOnIsland === 0 && game.result === 'Victory' },
  { id: '32', title: 'Dahan Protector', condition: (_: Game[], game: Game) => game.remainingDahan >= 10 && game.result === 'Victory' },
  { id: '33', title: 'Card Efficiency', condition: (_: Game[], game: Game) => game.cardsRemainingInDeck >= 10 && game.result === 'Victory' },
]

// Computed properties for difficulty and score
const calculatedDifficulty = computed(() => {
  return newGame.value.adversaryDifficulty // Placeholder
})

const calculatedScore = computed(() => {
  // Implement your score calculation logic here
  return 0 // Placeholder
})

const handleViewUser = () => {
  if (props.session && props.session.user) {
    router.push(`/user-profile/${props.session.user.id}`)
  } else {
    console.error('User is not logged in')
  }
}

const handleViewCharts = () => {
  router.push('/leaderboards')
}

const handleLogOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    router.push('/login')
  } catch (error: unknown) {
    console.error('Error signing out:', error)
    if (error instanceof Error) {
      errorMessage.value = error.message
    } else {
      errorMessage.value = 'Failed to sign out. Please try again.'
    }
  }
}
const handleSubmit = async () => {
  try {
    if (!props.session) {
      console.log('No session found. User must be logged in to create a game.')
      errorMessage.value = 'You must be logged in to create a game.'
      return
    }

    const userId = props.session.user.id
    console.log('User ID:', userId)

    // Insert the new game
    const { data: gameData, error: gameError } = await supabase
        .from('games')
        .insert([{ ...newGame.value, userId }])
        .select()

    if (gameError) {
      console.error('Error inserting new game:', gameError)
      throw gameError
    }

    console.log('Game created:', gameData)

    // Fetch all games for the user to check achievements
    const { data: userGames, error: gamesError } = await supabase
        .from('games')
        .select('*')
        .eq('userId', userId)

    if (gamesError) {
      console.error('Error fetching user games:', gamesError)
      throw gamesError
    }

    console.log('Total user games:', userGames.length)

    // Calculate achievements
    console.log('Checking for new achievements...')
    const newAchievements = achievements.filter(achievement => {
      const condition = achievement.condition;
      let result;
      if (condition.length === 1) {
        result = (condition as (games: Game[]) => boolean)(userGames as Game[]);
      } else {
        result = (condition as (games: Game[], game: Game) => boolean)(userGames as Game[], gameData[0] as Game);
      }
      console.log(`Achievement "${achievement.title}" condition met:`, result)
      return result;
    });

    console.log('Potential new achievements:', newAchievements)

    // Fetch existing user achievements
    const { data: existingAchievements, error: existingAchievementsError } = await supabase
        .from('user_achievements')
        .select('achievement_id')
        .eq('user_id', userId)

    if (existingAchievementsError) {
      console.error('Error fetching existing achievements:', existingAchievementsError)
      throw existingAchievementsError
    }

    console.log('Existing achievements:', existingAchievements)

    // Filter out achievements the user already has
    const uniqueNewAchievements = newAchievements.filter(achievement =>
        !existingAchievements.some(existing => existing.achievement_id === achievement.id)
    );

    console.log('Unique new achievements:', uniqueNewAchievements)

    // Insert new achievements
    if (uniqueNewAchievements.length > 0) {
      const { error: achievementsError } = await supabase
          .from('user_achievements')
          .insert(
              uniqueNewAchievements.map(achievement => ({
                user_id: userId,
                achievement_id: achievement.id,
              }))
          )

      if (achievementsError) {
        console.error('Error inserting new achievements:', achievementsError)
        throw achievementsError
      }

      console.log('New achievements inserted successfully')

      // Notify user about new achievements
      const achievementMessage = `Congratulations! You've earned ${uniqueNewAchievements.length} new achievement${uniqueNewAchievements.length > 1 ? 's' : ''}:\n${uniqueNewAchievements.map(a => a.title).join('\n')}`
      console.log(achievementMessage)
      alert(achievementMessage)
    } else {
      console.log('No new achievements earned')
    }

    closeModal()
    // Optionally, you can reset the form or fetch updated game list here
  } catch (error: unknown) {
    console.error('Error in handleSubmit:', error)
    if (error instanceof Error) {
      errorMessage.value = error.message
    } else if (typeof error === 'object' && error !== null && 'message' in error) {
      errorMessage.value = (error as { message: string }).message
    } else {
      errorMessage.value = 'An unknown error occurred. Please try again.'
    }
  }
}
</script>

<template>
  <header class="flex justify-between items-center p-4">
    <h1
        class="text-xl font-bold cursor-pointer hover:text-primary transition-colors duration-200"
        @click="handleViewCharts"
    >
      spirit island stats
    </h1>
    <div v-if="session" class="flex items-center space-x-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <Icon icon="radix-icons:moon" class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Icon icon="radix-icons:sun" class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span class="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem @click="mode = 'light'">Light</DropdownMenuItem>
          <DropdownMenuItem @click="mode = 'dark'">Dark</DropdownMenuItem>
          <DropdownMenuItem @click="mode = 'auto'">System</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <Icon icon="radix-icons:person" class="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem @click="handleViewUser">
            View User
          </DropdownMenuItem>
          <DropdownMenuItem @click="handleLogOut">
            Log Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog :open="isModalOpen" @update:open="isModalOpen = $event">
        <DialogTrigger asChild>
          <Button variant="default" @click="openModal">
            <Icon icon="radix-icons:plus" class="mr-2 h-4 w-4" />
            New Game
          </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Game</DialogTitle>
            <DialogDescription>
              Enter the details of your new Spirit Island game here.
            </DialogDescription>
          </DialogHeader>
          <form @submit.prevent="handleSubmit" class="space-y-8">
            <div v-if="errorMessage" class="text-red-500 mb-4">{{ errorMessage }}</div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <Label for="date">Date</Label>
                <Input id="date" v-model="newGame.date" type="date" />
              </div>
              <div>
                <Label for="numPlayers">Number of Players</Label>
                <Input id="numPlayers" v-model="newGame.numPlayers" type="number" min="1" max="6" />
              </div>
              <div>
                <Label for="islandState">Island State</Label>
                <Select v-model="newGame.islandState">
                  <SelectTrigger>
                    <SelectValue placeholder="Select island state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Healthy">Healthy</SelectItem>
                    <SelectItem value="Blighted">Blighted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label for="adversary">Adversary</Label>
                <Select v-model="newGame.adversary">
                  <SelectTrigger>
                    <SelectValue placeholder="Select adversary" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Brandenburg-Prussia">Brandenburg-Prussia</SelectItem>
                    <SelectItem value="England">England</SelectItem>
                    <!-- Add other adversaries here -->
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label for="adversaryDifficulty">Adversary Difficulty</Label>
                <Input id="adversaryDifficulty" v-model="newGame.adversaryDifficulty" type="number" min="0" max="6" />
              </div>
              <div>
                <Label for="scenario">Scenario</Label>
                <Select v-model="newGame.scenario">
                  <SelectTrigger>
                    <SelectValue placeholder="Select scenario" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Blitz">Blitz</SelectItem>
                    <SelectItem value="Guard the Isle's Heart">Guard the Isle's Heart</SelectItem>
                    <!-- Add other scenarios here -->
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label for="result">Result</Label>
                <Select v-model="newGame.result">
                  <SelectTrigger>
                    <SelectValue placeholder="Select result" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Victory">Victory</SelectItem>
                    <SelectItem value="Defeat">Defeat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Calculated Difficulty</Label>
                <Input :value="calculatedDifficulty" readonly />
              </div>
              <div>
                <Label>Score</Label>
                <Input :value="calculatedScore" readonly />
              </div>
            </div>
            <div class="flex justify-end space-x-2">
              <Button @click="closeModal" variant="outline">Cancel</Button>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
    <div v-else>
      <!-- Add a login button or link here -->
      <Button @click="router.push('/login')">Log In</Button>
    </div>
  </header>
</template>