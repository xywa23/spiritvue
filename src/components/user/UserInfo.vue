<script setup lang="ts">
import { ref, reactive } from 'vue'
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

const user = reactive({
  name: 'Jane Doe',
  username: '@janedoe',
  bio: 'UI/UX Designer | Coffee Enthusiast | Travel Lover',
  location: 'San Francisco, CA',
  followers: 1234,
  following: 567,
  avatarUrl: '/api/placeholder/400/320'
})

const isFollowing = ref(false)
const isEditing = ref(false)

// Create a temporary user object to hold edits
const tempUser = reactive({ ...user })

const toggleFollow = () => {
  isFollowing.value = !isFollowing.value
}

const startEditing = () => {
  // Copy current user data to tempUser
  Object.assign(tempUser, user)
  isEditing.value = true
}

const saveChanges = () => {
  // Save changes from tempUser to user
  Object.assign(user, tempUser)
  isEditing.value = false
  // Here you would typically send the updated user data to your backend
  console.log('Saving changes:', user)
}

const cancelEditing = () => {
  isEditing.value = false
  // Discard changes by not copying from tempUser to user
}

const shareProfile = () => {
  // Implement share functionality
  console.log('Sharing profile...')
}
</script>

<template>
  <Card class="w-full h-full flex flex-col relative">
    <div class="absolute top-2 right-2 flex space-x-2">
      <Button v-if="isEditing" variant="default" size="sm" @click="saveChanges">
        <Icon icon="radix-icons:check" class="mr-2 h-4 w-4" />
        Save
      </Button>
      <Button v-if="isEditing" variant="outline" size="sm" @click="cancelEditing">
        Cancel
      </Button>
      <Button v-if="!isEditing" variant="ghost" size="icon" @click="shareProfile">
        <Icon icon="radix-icons:share-2" class="w-4 h-4" />
      </Button>
      <DropdownMenu v-if="!isEditing">
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Icon icon="radix-icons:dots-horizontal" class="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem @click="startEditing">
            <Icon icon="radix-icons:pencil-2" class="mr-2 h-4 w-4" />
            <span>Editar Perfil</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    <CardHeader>
      <div class="flex items-center space-x-4">
        <Avatar class="h-12 w-12">
          <AvatarImage :src="user.avatarUrl" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle v-if="!isEditing">{{ user.name }}</CardTitle>
          <Input v-else v-model="tempUser.name" class="mt-1" />
          <CardDescription v-if="!isEditing">{{ user.username }}</CardDescription>
          <Input v-else v-model="tempUser.username" class="mt-1" />
        </div>
      </div>
    </CardHeader>
    <CardContent class="flex-grow flex flex-col justify-between">
      <div>
        <p v-if="!isEditing" class="text-sm text-gray-500 dark:text-gray-400">{{ user.bio }}</p>
        <Textarea v-else v-model="tempUser.bio" class="mt-1" />
        <div class="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Icon icon="radix-icons:map-pin" class="mr-2 h-4 w-4" />
          <span v-if="!isEditing">{{ user.location }}</span>
          <Input v-else v-model="tempUser.location" class="ml-2" />
        </div>
      </div>
      <div class="mt-auto">
        <Separator class="my-4" />
        <div class="flex justify-between text-sm text-gray-500 dark:text-gray-400">
          <div>
            <strong class="text-gray-900 dark:text-gray-100">{{ user.followers }}</strong> Followers
          </div>
          <div>
            <strong class="text-gray-900 dark:text-gray-100">{{ user.following }}</strong> Following
          </div>
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
</template>