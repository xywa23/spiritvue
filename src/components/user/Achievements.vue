<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Icon } from '@iconify/vue'
import { supabase } from "@/lib/supabase.ts";
import { User } from "@supabase/supabase-js";

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'legendary';
  isActive: boolean;
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
  if (error) {
    console.error('Error fetching current user:', error)
    errorMessage.value = 'Error fetching user data'
    return null
  }
  return user
}

async function fetchAchievements() {
  isLoading.value = true
  errorMessage.value = ''
  try {
    currentUser.value = await getCurrentUser()
    if (!currentUser.value) {
      throw new Error('No authenticated user found')
    }
    console.log('Current user:', currentUser.value.id)

    // Fetch all achievements
    const { data: allAchievements, error: achievementsError } = await supabase
        .from('achievements')
        .select('*')

    if (achievementsError) throw achievementsError
    console.log('All achievements:', allAchievements)

    // Fetch user achievements using raw SQL query
    const { data: userAchievements, error: userAchievementsError } = await supabase
        .rpc('get_user_achievements', { user_id: currentUser.value.id })

    if (userAchievementsError) {
      console.error('Error fetching user achievements:', userAchievementsError)
      throw userAchievementsError
    }

    console.log('Raw user achievements data:', userAchievements)

    if (!userAchievements || userAchievements.length === 0) {
      console.warn('No user achievements found for user ID:', currentUser.value.id)
    }

    // Create a Set of the user's achievement IDs for faster lookup
    const userAchievementIds = new Set(userAchievements?.map((ua: UserAchievement) => ua.achievement_id) || [])
    console.log('User achievement IDs:', Array.from(userAchievementIds))

    // Map all achievements and set isActive based on user achievements
    achievements.value = allAchievements.map((achievement: Achievement) => {
      const isActive = userAchievementIds.has(achievement.id)
      console.log(`Achievement ${achievement.id} isActive:`, isActive)
      return {
        ...achievement,
        isActive
      }
    })

    console.log('Final achievements array:', achievements.value)

  } catch (error) {
    console.error('Error in fetchAchievements:', error)
    errorMessage.value = error instanceof Error ? error.message : 'Error fetching achievements'
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchAchievements)
</script>

<template>
  <Card class="w-full">
    <CardHeader>
      <CardTitle>Achievements</CardTitle>
    </CardHeader>
    <CardContent>
      <div v-if="isLoading" class="text-center py-4">Loading achievements...</div>
      <div v-else-if="errorMessage" class="text-red-500 text-center py-4">{{ errorMessage }}</div>
      <div v-else class="flex flex-wrap justify-around">
        <div v-for="achievement in achievements" :key="achievement.id" class="text-center mb-6 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5">
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
  </Card>
</template>