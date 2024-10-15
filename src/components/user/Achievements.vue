<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Icon } from '@iconify/vue'
import { supabase } from "@/lib/supabase.ts";
import { User } from "@supabase/supabase-js";

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

const isCurrentUserProfile = computed(() => {
  return currentUser.value && currentUser.value.id === props.identifier
})

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

    const userAchievementIds = new Set(userAchievements.map(ua => ua.achievement_id))

    achievements.value = allAchievements.map(achievement => ({
      ...achievement,
      isActive: userAchievementIds.has(achievement.id)
    }))

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

onMounted(fetchAchievements)
</script>

<template>
  <Card class="w-full">
    <CardHeader>
      <CardTitle>Achievements{{ isCurrentUserProfile ? '' : '' }}</CardTitle>
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