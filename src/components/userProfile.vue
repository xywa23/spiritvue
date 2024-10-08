<script setup lang="ts">
import {onMounted, ref} from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table'
import {supabase} from "@/lib/supabase.ts";
import { Badge } from '@/components/ui/badge'
import { Icon } from '@iconify/vue'

// Mock user data
const user = ref({
  name: 'Jane Doe',
  username: '@janedoe',
  bio: 'UI/UX Designer | Coffee Enthusiast | Travel Lover',
  location: 'San Francisco, CA',
  followers: 1234,
  following: 567,
  avatarUrl: '/api/placeholder/400/320'
})

const isFollowing = ref(false)

const toggleFollow = () => {
  isFollowing.value = !isFollowing.value
}

// Mock data for new components
const achievements = ref([
  { id: 1, title: 'Design Champion', description: 'Won the annual design competition' },
  { id: 2, title: 'Coffee Connoisseur', description: 'Visited 100 unique coffee shops' },
  { id: 3, title: 'Globe Trotter', description: 'Traveled to 20 countries' }
])

const topSpirits = ref([
  { id: 1, name: 'Whiskey', rating: 5 },
  { id: 2, name: 'Gin', rating: 4 },
  { id: 3, name: 'Rum', rating: 3 }
])

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
const pageSize = 5 // Number of games to fetch per page
const currentPage = ref(1)
const hasMoreGames = ref(true)
const sortColumn = ref('date')
const sortOrder = ref<'asc' | 'desc'>('desc')

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
        .order('date', { ascending: false })
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
    // If clicking the same column, toggle the order
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    // If clicking a new column, set it as the sort column and default to ascending order
    sortColumn.value = column
    sortOrder.value = 'asc'
  }

  // Reset the games array and fetch sorted games
  games.value = []
  currentPage.value = 1
  hasMoreGames.value = true
  readGames()
}

// Compute the sort icon to display
const getSortIcon = (column: string) => {
  if (sortColumn.value !== column) return 'mdi:sort'
  return sortOrder.value === 'asc' ? 'mdi:sort-ascending' : 'mdi:sort-descending'
}

onMounted(() => {
  readGames()
})
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <Card class="w-[calc(50%-0.5rem)]">
      <CardHeader>
        <div class="flex items-center space-x-4">
          <Avatar class="h-12 w-12">
            <AvatarImage :src="user.avatarUrl" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{{ user.name }}</CardTitle>
            <CardDescription>{{ user.username }}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ user.bio }}</p>
        <div class="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
          <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="mr-2 h-4 w-4"
          >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {{ user.location }}
        </div>
        <Separator class="my-4" />
        <div class="flex justify-between text-sm text-gray-500 dark:text-gray-400">
          <div>
            <strong class="text-gray-900 dark:text-gray-100">{{ user.followers }}</strong> Followers
          </div>
          <div>
            <strong class="text-gray-900 dark:text-gray-100">{{ user.following }}</strong> Following
          </div>
        </div>
      </CardContent>
      <CardFooter class="flex justify-between">
        <Button variant="outline" @click="toggleFollow">
          {{ isFollowing ? 'Unfollow' : 'Follow' }}
        </Button>
        <Button variant="outline">Message</Button>
      </CardFooter>
    </Card>

    <Card class="w-[calc(25%-0.75rem)]">
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

    <Card class="w-[calc(25%-0.75rem)]">
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

    <Card class="w-full">
      <CardHeader>
        <CardTitle>Recent Games</CardTitle>
      </CardHeader>
      <CardContent>
        <div v-if="errorMessage" class="text-red-500 mb-4">{{ errorMessage }}</div>
        <div v-if="isLoading">Loading...</div>
        <Table v-else>
          <TableCaption>Spirit Island Game Results</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead @click="sortGames('date')" class="cursor-pointer">
                Date
                <Icon :icon="getSortIcon('date')" class="inline-block ml-1" />
              </TableHead>
              <TableHead @click="sortGames('spirits')" class="cursor-pointer">
                Spirits
                <Icon :icon="getSortIcon('spirits')" class="inline-block ml-1" />
              </TableHead>
              <TableHead @click="sortGames('terrorLevel')" class="cursor-pointer">
                Terror Level
                <Icon :icon="getSortIcon('terrorLevel')" class="inline-block ml-1" />
              </TableHead>
              <TableHead @click="sortGames('islandState')" class="cursor-pointer">
                Island State
                <Icon :icon="getSortIcon('islandState')" class="inline-block ml-1" />
              </TableHead>
              <TableHead @click="sortGames('result')" class="cursor-pointer">
                Result
                <Icon :icon="getSortIcon('result')" class="inline-block ml-1" />
              </TableHead>
              <TableHead @click="sortGames('fun')" class="cursor-pointer">
                Fun
                <Icon :icon="getSortIcon('fun')" class="inline-block ml-1" />
              </TableHead>
              <TableHead @click="sortGames('adversary')" class="cursor-pointer">
                Adversary
                <Icon :icon="getSortIcon('adversary')" class="inline-block ml-1" />
              </TableHead>
              <TableHead @click="sortGames('scenario')" class="cursor-pointer">
                Scenario
                <Icon :icon="getSortIcon('scenario')" class="inline-block ml-1" />
              </TableHead>
              <TableHead @click="sortGames('difficulty')" class="cursor-pointer">
                Difficulty
                <Icon :icon="getSortIcon('difficulty')" class="inline-block ml-1" />
              </TableHead>
              <TableHead @click="sortGames('score')" class="cursor-pointer">
                Score
                <Icon :icon="getSortIcon('score')" class="inline-block ml-1" />
              </TableHead>
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
        <Button @click="loadMoreGames" :disabled="isLoading || !hasMoreGames" class="mt-4">
          {{ isLoading ? 'Loading...' : hasMoreGames ? 'Load More Games' : 'No More Games' }}
        </Button>
      </CardContent>
    </Card>
  </div>
</template>