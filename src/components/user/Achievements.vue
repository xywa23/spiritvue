<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/vue'
import { supabase } from "@/lib/supabase.ts";
import { User } from "@supabase/supabase-js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Accept the identifier prop
const props = defineProps<{
  identifier: string
}>()

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'legendary';
  isActive: boolean;
  earnedAt?: string;
}

interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: number;
  earned_at: string;
  title: string;
  description: string;
}

const achievements = ref<Achievement[]>([])
const isLoading = ref(true)
const errorMessage = ref('')
const currentUser = ref<User | null>(null)
const isModalOpen = ref(false)

const displayedAchievements = computed(() => achievements.value.slice(0, 9))

const hasMoreAchievements = computed(() => achievements.value.length > 9)

const rarityClasses = {
  common: 'text-green-600 dark:text-green-500',
  rare: 'text-purple-600 dark:text-purple-500',
  legendary: 'text-orange-500 dark:text-orange-400'
}

const getAchievementClass = (achievement: Achievement) => {
  if (!achievement.isActive) {
    return 'text-gray-300 dark:text-gray-700'
  }
  return rarityClasses[achievement.rarity]
}

const getIconClass = (achievement: Achievement) => {
  if (!achievement.isActive) {
    return 'text-gray-400 dark:text-gray-600 opacity-50'
  }
  return 'text-white'
}

const getCurrentUser = async (): Promise<User | null> => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error && error.message !== "Auth session missing!") {
    console.error('Error fetching current user:', error)
  }
  return user
}

async function fetchAchievements() {
  isLoading.value = true
  errorMessage.value = ''
  try {
    currentUser.value = await getCurrentUser()

    const [allAchievements, userAchievements] = await Promise.all([
      fetchAllAchievements(),
      fetchUserAchievements(props.identifier)
    ])

    const userAchievementMap = new Map(userAchievements.map(ua => [ua.achievement_id, ua.earned_at]))

    achievements.value = allAchievements.map(achievement => ({
      ...achievement,
      isActive: userAchievementMap.has(achievement.id),
      earnedAt: userAchievementMap.get(achievement.id) || undefined
    }))

    // Sort achievements: active first (sorted by earnedAt), then inactive
    achievements.value.sort((a, b) => {
      if (a.isActive && b.isActive) {
        // Both active, sort by earnedAt (latest first)
        return new Date(b.earnedAt!).getTime() - new Date(a.earnedAt!).getTime()
      } else if (a.isActive) {
        return -1 // a is active, b is not, so a comes first
      } else if (b.isActive) {
        return 1 // b is active, a is not, so b comes first
      } else {
        // Both inactive, keep original order
        return 0
      }
    })

  } catch (error: unknown) {
    console.error('Error in fetchAchievements:', error)
    errorMessage.value = error instanceof Error ? error.message : 'Error fetching achievements'
  } finally {
    isLoading.value = false
  }
}

async function fetchAllAchievements(): Promise<Achievement[]> {
  const { data, error } = await supabase.from('achievements').select('*')
  if (error) throw new Error('Failed to fetch all achievements')
  return data
}

async function fetchUserAchievements(userId: string): Promise<UserAchievement[]> {
  const { data, error } = await supabase.rpc('get_user_achievements', { user_id: userId })
  if (error) throw new Error('Failed to fetch user achievements')
  return data || []
}

function openModal() {
  isModalOpen.value = true
}

onMounted(fetchAchievements)
</script>

<template>
  <Card class="w-full">
    <CardHeader>
      <CardTitle>Latest Achievements</CardTitle>
    </CardHeader>
    <CardContent>
      <div v-if="isLoading" class="text-center py-4">Loading achievements...</div>
      <div v-else-if="errorMessage" class="text-red-500 text-center py-4">{{ errorMessage }}</div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div v-for="achievement in displayedAchievements" :key="achievement.id" class="text-center">
          <div class="relative w-20 h-20 mx-auto">
            <Icon icon="mdi:hexagon" :class="['w-20 h-20', getAchievementClass(achievement)]" />
            <div class="absolute inset-0 flex justify-center items-center">
              <Icon :icon="achievement.icon" :class="['h-8 w-8', getIconClass(achievement)]" />
            </div>
          </div>
          <strong :class="['text-sm block mt-2', achievement.isActive ? '' : 'text-gray-400 dark:text-gray-600']">{{ achievement.title }}</strong>
          <p :class="['text-xs', achievement.isActive ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400 dark:text-gray-600']">{{ achievement.description }}</p>
        </div>
      </div>
    </CardContent>
    <CardFooter v-if="hasMoreAchievements" class="justify-center">
      <Button variant="secondary" @click="openModal">
        View All Achievements
      </Button>
    </CardFooter>
  </Card>

  <Dialog :open="isModalOpen" @update:open="isModalOpen = $event">
    <DialogContent class="sm:max-w-[80%] max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>All Achievements</DialogTitle>
      </DialogHeader>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        <div v-for="achievement in achievements" :key="achievement.id" class="text-center">
          <div class="relative w-20 h-20 mx-auto">
            <Icon icon="mdi:hexagon" :class="['w-20 h-20', getAchievementClass(achievement)]" />
            <div class="absolute inset-0 flex justify-center items-center">
              <Icon :icon="achievement.icon" :class="['h-8 w-8', getIconClass(achievement)]" />
            </div>
          </div>
          <strong :class="['text-sm block mt-2', achievement.isActive ? '' : 'text-gray-400 dark:text-gray-600']">{{ achievement.title }}</strong>
          <p :class="['text-xs', achievement.isActive ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400 dark:text-gray-600']">{{ achievement.description }}</p>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>