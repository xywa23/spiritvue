<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Icon } from '@iconify/vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { supabase } from "@/lib/supabase.ts"

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
  location: string | null;
  website: string | null;
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
  location: null,
  website: null,
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
    const { error } = await supabase
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

    if (error) throw error

    Object.assign(user, tempUser)
    isEditing.value = false
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
      <div class="flex items-center space-x-4">
        <Avatar class="h-12 w-12">
          <AvatarImage :src="user.avatarUrl || '/api/placeholder/400/320'" />
          <AvatarFallback>{{ user.username.substring(0, 2).toUpperCase() }}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle v-if="!isEditing">{{ user.displayName || user.username }}</CardTitle>
          <Input v-else v-model="tempUser.displayName" class="mt-1" placeholder="Display Name" />
          <CardDescription v-if="!isEditing">@{{ user.username }}</CardDescription>
          <Input v-else v-model="tempUser.username" class="mt-1" placeholder="Username" />
        </div>
      </div>
    </CardHeader>
    <CardContent class="flex-grow flex flex-col justify-between">
      <div>
        <p v-if="!isEditing" class="text-sm text-gray-500 dark:text-gray-400">{{ user.bio }}</p>
        <Textarea v-else v-model="tempUser.bio" class="mt-1" placeholder="Bio" />
        <div v-if="!isEditing" class="mt-2 text-sm text-gray-500 dark:text-gray-400">
          <p v-if="user.location"><Icon icon="radix-icons:map-pin" class="inline mr-1" /> {{ user.location }}</p>
          <p v-if="user.website"><Icon icon="radix-icons:link-2" class="inline mr-1" /> {{ user.website }}</p>
        </div>
      </div>
      <div class="mt-auto">
        <Separator class="my-4" />
        <div class="flex justify-between text-sm text-gray-500 dark:text-gray-400">
          <div>
            <strong class="text-gray-900 dark:text-gray-100">{{ user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A' }}</strong> Joined
          </div>
          <div>
            <strong class="text-gray-900 dark:text-gray-100">{{ user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A' }}</strong> Last updated
          </div>
        </div>
      </div>
    </CardContent>
    <CardFooter class="flex justify-between">
      <Button v-if="!isCurrentUserProfile" variant="outline" @click="toggleFollow">
        {{ isFollowing ? 'Unfollow' : 'Follow' }}
      </Button>
      <Button v-if="!isCurrentUserProfile" variant="outline">Message</Button>
    </CardFooter>
  </Card>
  <div v-else class="flex justify-center items-center h-full">
    <p>Loading profile...</p>
  </div>
</template>