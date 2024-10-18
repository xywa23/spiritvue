<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@iconify/vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { supabase } from "@/lib/supabase.ts"
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { countries }  from '@/components/countries'

// Accept the identifier prop
const props = defineProps<{
  identifier: string
}>()

interface Profile {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string | null;
  location: string | undefined;
  website: string | null;
  loggedGames: number;
  followers: number;
  following: number;
  createdAt: string | null;
  updatedAt: string | null;
}

const user = reactive<Profile>({
  id: '',
  userId: '',
  username: '',
  displayName: '',
  bio: '',
  avatarUrl: null,
  location: undefined,
  website: null,
  loggedGames: 12,
  followers: 4,
  following: 5,
  createdAt: null,
  updatedAt: null
})

const isLoading = ref(true)
const errorMessage = ref('')
const isFollowing = ref(false)
const isEditing = ref(false)
const currentUser = ref<any | null>(null)

// Create a temporary user object to hold edits
const tempUser = reactive<Profile>({ ...user })

const isCurrentUserProfile = computed(() => {
  return currentUser.value && currentUser.value.id === user.userId
})

const fetchUserProfile = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('userId', props.identifier)
        .single()

    if (error) throw error
    if (data) {
      Object.assign(user, data)
    }
  } catch (error) {
    console.error('Error fetching user profile:', error)
    errorMessage.value = error instanceof Error ? error.message : 'Error fetching user profile'
  } finally {
    isLoading.value = false
  }
}

const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error && error.message !== "Auth session missing!") {
    console.error('Error fetching current user:', error)
  }
  currentUser.value = user
}

const toggleFollow = () => {
  isFollowing.value = !isFollowing.value
  // Implement follow/unfollow logic here
}

const startEditing = () => {
  Object.assign(tempUser, user)
  isEditing.value = true
}

const saveChanges = async () => {
  try {
    const { data, error } = await supabase
        .from('profiles')
        .update({
          username: tempUser.username,
          displayName: tempUser.displayName,
          bio: tempUser.bio,
          location: tempUser.location,
          website: tempUser.website,
          updatedAt: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()

    if (error) throw error

    if (data && data.length > 0) {
      // Update the user object with the returned data
      Object.assign(user, data[0])
      isEditing.value = false
    } else {
      throw new Error('No data returned from update operation')
    }
  } catch (error) {
    console.error('Error updating profile:', error)
    errorMessage.value = error instanceof Error ? error.message : 'Error updating profile'
  }
}

const cancelEditing = () => {
  isEditing.value = false
}

const shareProfile = () => {
  // Implement share functionality
  console.log('Sharing profile...')
}

onMounted(async () => {
  await getCurrentUser()
  await fetchUserProfile()
})
</script>

<template>
  <Card class="w-full h-full flex flex-col relative" v-if="!isLoading">
    <div v-if="errorMessage" class="text-red-500 p-4">{{ errorMessage }}</div>
    <div class="absolute top-2 right-2 flex space-x-2">
      <Button v-if="isEditing && isCurrentUserProfile" variant="default" size="sm" @click="saveChanges">
        <Icon icon="radix-icons:check" class="mr-2 h-4 w-4" />
        Save
      </Button>
      <Button v-if="isEditing && isCurrentUserProfile" variant="outline" size="sm" @click="cancelEditing">
        Cancel
      </Button>
      <Button v-if="!isEditing" variant="ghost" size="icon" @click="shareProfile">
        <Icon icon="radix-icons:share-2" class="w-4 h-4" />
      </Button>
      <DropdownMenu v-if="!isEditing && isCurrentUserProfile">
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Icon icon="radix-icons:dots-horizontal" class="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem @click="startEditing">
            <Icon icon="radix-icons:pencil-2" class="mr-2 h-4 w-4" />
            <span>Edit Profile</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    <CardHeader>
      <div class="flex items-center space-x-6">
        <Avatar class="h-24 w-24">
          <AvatarImage :src="user.avatarUrl || '/api/placeholder/400/320'" />
          <AvatarFallback class="text-2xl">{{ user.username.substring(0, 2).toUpperCase() }}</AvatarFallback>
        </Avatar>
        <div class="flex-grow">
          <div class="flex items-center">
            <CardTitle v-if="!isEditing" class="text-3xl font-bold mr-4">@{{ user.username }}</CardTitle>
            <Input v-if="isEditing" v-model="tempUser.username" class="text-2xl mr-4" placeholder="Username" />
            <div class="flex items-center gap-4">
              <Badge variant="default" class="bg-purple-500">PRO</Badge>
            </div>
          </div>
          <div class="flex items-center justify-between mt-4">
            <CardDescription v-if="!isEditing" class="flex items-center">
              <Icon icon="radix-icons:sewing-pin-filled" class="mr-1" />
              <span>{{ user.location || 'No location set' }}</span>
            </CardDescription>
            <Select v-if="isEditing" v-model="tempUser.location">
              <SelectTrigger class="w-[180px]">
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="country in countries" :key="country" :value="country">
                  {{ country }}
                </SelectItem>
              </SelectContent>
            </Select>
            <Button v-if="!isCurrentUserProfile && !isEditing" variant="link" size="sm" @click="toggleFollow">
              <Icon :icon="isFollowing ? 'radix-icons:minus-circled' : 'radix-icons:plus-circled'" class="mr-2 h-4 w-4" />
              {{ isFollowing ? 'Unfollow' : 'Follow' }}
            </Button>
          </div>
        </div>
      </div>
    </CardHeader>
    <CardContent class="flex-grow flex flex-col justify-between">
      <div>
        <p v-if="!isEditing" class="text-sm text-gray-500 dark:text-gray-400">{{ user.bio }}</p>
        <Textarea v-else v-model="tempUser.bio" class="mt-1" placeholder="Bio" />

        <!-- Updated element with custom colored Separators -->
        <div class="mt-12 flex justify-center w-full text-sm">
          <div class="flex items-center space-x-7">
            <div class="flex flex-col items-center">
              <span class="text-4xl font-semibold">{{ user.loggedGames }}</span>
              <span class="text-gray-500 dark:text-gray-400">Logged Games</span>
            </div>
            <Separator orientation="vertical" class="h-10 w-px bg-gray-300 dark:bg-gray-700 self-center" />
            <div class="flex flex-col items-center">
              <span class="text-4xl font-semibold">{{ user.followers }}</span>
              <span class="text-gray-500 dark:text-gray-400">Followers</span>
            </div>
            <Separator orientation="vertical" class="h-10 w-px bg-gray-300 dark:bg-gray-700 self-center" />
            <div class="flex flex-col items-center">
              <span class="text-4xl font-semibold">{{ user.following }}</span>
              <span class="text-gray-500 dark:text-gray-400">Following</span>
            </div>
          </div>
        </div>

        <div v-if="!isEditing" class="mt-2 text-sm text-gray-500 dark:text-gray-400">
          <p v-if="user.website"><Icon icon="radix-icons:link-2" class="inline mr-1" /> {{ user.website }}</p>
        </div>
      </div>
    </CardContent>
  </Card>
  <div v-else class="flex justify-center items-center h-full">
    <p>Loading profile...</p>
  </div>
</template>