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

// Computed properties for difficulty and score
const calculatedDifficulty = computed(() => {
  return newGame.value.adversaryDifficulty // Placeholder
})

const calculatedScore = computed(() => {
  // Implement your score calculation logic here
  return 0 // Placeholder
})

const handleViewUser = () => {
  router.push('/user-profile')
}

const handleViewCharts = () => {
  router.push('/table')
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
      errorMessage.value = 'You must be logged in to create a game.'
      return
    }

    const { data, error } = await supabase
        .from('games')
        .insert([{ ...newGame.value, userId: props.session.user.id }])
        .select()

    if (error) throw error
    console.log('Game created:', data)
    closeModal()
    // Optionally, you can reset the form or fetch updated game list here
  } catch (error: unknown) {
    console.error('Error creating game:', error)
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