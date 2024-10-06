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

const router = useRouter()
const mode = useColorMode()
const isModalOpen = ref(false)

const openModal = () => {
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

// Form state
const formState = ref({
  numPlayers: 1,
  spirits: [],
  aspects: [],
  adversary: '',
  adversaryDiff: 0,
  scenario: '',
  board: [],
  result: '',
  terrorLevel: 1,
  islandState: '',
  fun: 1,
  blightOnIsland: 1,
  cardsRemainingInDeck: 1,
  remainingDahan: 1,
})

// Computed properties for difficulty and score
const calculatedDifficulty = computed(() => {
  // Implement your difficulty calculation logic here
  return 0 // Placeholder
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
const handleSubmit = () => {
  // Implement your submit logic here
  console.log('Form submitted:', formState.value)
  closeModal()
}
</script>

<template>
  <header class="flex justify-between items-center p-4">
    <h1 class="text-xl font-bold">spirit island stats</h1>
    <div class="flex items-center space-x-2">
      <Dialog :open="isModalOpen" @update:open="isModalOpen = $event">
        <DialogTrigger asChild>
          <Button variant="outline" @click="openModal">
            <Icon icon="mdi:plus" class="mr-2 h-4 w-4" />
            Add Game
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
            <div class="grid grid-cols-2 gap-4">
              <div>
                <Label for="numPlayers">Number of Players</Label>
                <Input id="numPlayers" v-model="formState.numPlayers" type="number" min="1" max="6" />
              </div>
              <div>
                <Label for="islandState">Island State</Label>
                <Select v-model="formState.islandState">
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
                <Select v-model="formState.adversary">
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
                <Label for="adversaryDiff">Adversary Difficulty</Label>
                <Input id="adversaryDiff" v-model="formState.adversaryDiff" type="number" min="0" max="6" />
              </div>
              <div>
                <Label for="scenario">Scenario</Label>
                <Select v-model="formState.scenario">
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
                <Select v-model="formState.result">
                  <SelectTrigger>
                    <SelectValue placeholder="Select result" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Victory">Victory</SelectItem>
                    <SelectItem value="Defeat">Defeat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <!-- Modified part starts here -->
              <div>
                <Label>Calculated Difficulty</Label>
                <Input :value="calculatedDifficulty" readonly />
              </div>
              <div>
                <Label>Score</Label>
                <Input :value="calculatedScore" readonly />
              </div>
              <!-- Modified part ends here -->
            </div>
            <div class="flex justify-end space-x-2">
              <Button @click="closeModal" variant="outline">Cancel</Button>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Button variant="outline" @click="handleViewCharts">
        <Icon icon="mdi:chart-bar" class="mr-2 h-4 w-4" />
        Charts
      </Button>
      <Button variant="outline" @click="handleViewUser">
        <Icon icon="mdi:user" class="mr-2 h-4 w-4" />
        User
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
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
    </div>
  </header>
</template>