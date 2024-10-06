<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

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

const recentActivities = ref([
  { id: 1, action: 'Liked a post', time: '2 hours ago' },
  { id: 2, action: 'Commented on a design', time: '1 day ago' },
  { id: 3, action: 'Shared a travel photo', time: '3 days ago' }
])

const topSpirits = ref([
  { id: 1, name: 'Whiskey', rating: 5 },
  { id: 2, name: 'Gin', rating: 4 },
  { id: 3, name: 'Rum', rating: 3 }
])
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <Card class="w-[350px]">
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

    <Card class="w-[350px]">
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

    <Card class="w-[350px]">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ul class="space-y-2">
          <li v-for="activity in recentActivities" :key="activity.id" class="text-sm">
            <span>{{ activity.action }}</span>
            <span class="text-gray-500 dark:text-gray-400 ml-2">{{ activity.time }}</span>
          </li>
        </ul>
      </CardContent>
    </Card>

    <Card class="w-[350px]">
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
  </div>
</template>