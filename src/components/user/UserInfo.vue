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
import { useToast } from '@/components/ui/toast' // Import the toast hook

const { toast } = useToast()

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

const BIO_MAX_LENGTH = 278 // Set the maximum character limit for the bio

const bioCharCount = computed(() => tempUser.bio.length)

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

const avatarFile = ref<File | null>(null)
const avatarPreview = ref<string | null>(null)

const validateAvatarFile = (file: File): string | null => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png'];

  if (file.size > maxSize) {
    return 'File size exceeds 5MB limit';
  }

  if (!allowedTypes.includes(file.type)) {
    return 'File type not allowed. Please use JPEG or PNG';
  }

  return null;
}

const handleAvatarChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    const error = validateAvatarFile(file);
    if (error) {
      errorMessage.value = error;
      return;
    }
    avatarFile.value = file;
    avatarPreview.value = URL.createObjectURL(avatarFile.value);
  }
}

const startEditing = () => {
  Object.assign(tempUser, user)
  avatarPreview.value = user.avatarUrl
  isEditing.value = true
}

const cancelEditing = () => {
  isEditing.value = false
  avatarFile.value = null
  avatarPreview.value = null
}
const uploadAvatar = async (): Promise<string | null> => {
  console.log('Starting avatar upload process')
  if (!avatarFile.value || !currentUser.value) {
    console.log('No avatar file or current user, skipping upload')
    return null
  }

  const fileExt = avatarFile.value.name.split('.').pop()
  const fileName = `${currentUser.value.id}/avatar.${fileExt}`
  console.log(`Preparing to upload file: ${fileName}`)

  try {
    // First, attempt to remove the existing avatar
    if (user.avatarUrl) {
      const existingFilePath = user.avatarUrl.split('/').pop()
      if (existingFilePath) {
        console.log(`Attempting to remove existing avatar: ${existingFilePath}`)
        const { error: removeError } = await supabase.storage
            .from('avatars')
            .remove([`${currentUser.value.id}/${existingFilePath}`])

        if (removeError) {
          console.warn('Failed to remove existing avatar:', removeError)
        } else {
          console.log('Successfully removed existing avatar')
        }
      }
    }

    // Upload the new avatar
    console.log('Uploading new avatar')
    const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(fileName, avatarFile.value, { upsert: true })

    if (uploadError) {
      console.error('Upload error details:', uploadError)
      throw new Error(`Error uploading avatar: ${uploadError.message}`)
    }

    if (!data) {
      console.error('No data returned from upload')
      throw new Error('No data returned from upload')
    }

    console.log('Avatar uploaded successfully, getting public URL')
    const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

    console.log(`New avatar public URL: ${urlData.publicUrl}`)
    return urlData.publicUrl
  } catch (error) {
    console.error('Avatar upload failed:', error)
    throw error
  }
}

const avatarKey = ref(0)

const saveChanges = async () => {
  console.log('Starting saveChanges process')
  if (!currentUser.value) {
    console.log('No current user, aborting saveChanges')
    errorMessage.value = 'You must be logged in to update your profile';
    return;
  }
  try {
    if (tempUser.bio.length > BIO_MAX_LENGTH) {
      console.log(`Bio exceeds maximum length: ${tempUser.bio.length}/${BIO_MAX_LENGTH}`)
      throw new Error(`Bio exceeds maximum length of ${BIO_MAX_LENGTH} characters`)
    }

    let newAvatarUrl = user.avatarUrl
    console.log(`Current avatar URL: ${newAvatarUrl}`)

    if (avatarFile.value) {
      console.log('New avatar file detected, starting upload process')
      try {
        newAvatarUrl = await uploadAvatar()
        if (!newAvatarUrl) {
          console.error('Failed to upload avatar: No URL returned')
          throw new Error('Failed to upload avatar')
        }
        console.log(`New avatar URL after upload: ${newAvatarUrl}`)
      } catch (uploadError) {
        console.error('Avatar upload error:', uploadError)
        if (uploadError instanceof Error) {
          throw new Error(`Failed to upload avatar: ${uploadError.message}`)
        } else {
          throw new Error('Failed to upload avatar: Unknown error')
        }
      }
    } else {
      console.log('No new avatar file, skipping upload')
    }

    // Add a timestamp to the avatar URL for cache busting
    if (newAvatarUrl) {
      const timestamp = new Date().getTime()
      newAvatarUrl = `${newAvatarUrl}?t=${timestamp}`
    }

    console.log('Updating profile in database')
    const { data, error } = await supabase
        .from('profiles')
        .update({
          username: tempUser.username,
          displayName: tempUser.displayName,
          bio: tempUser.bio,
          location: tempUser.location,
          website: tempUser.website,
          avatarUrl: newAvatarUrl,
          updatedAt: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()

    if (error) {
      console.error('Profile update error:', error)
      throw new Error(`Error updating profile: ${error.message}`)
    }

    if (data && data.length > 0) {
      console.log('Profile updated successfully, updating local user object')
      console.log('New profile data:', data[0])
      // Update the user object with the new data
      Object.assign(user, data[0])

      console.log('Forcing avatar refresh')
      // Force avatar refresh by updating the key
      avatarKey.value += 1
      console.log(`New avatarKey value: ${avatarKey.value}`)

      isEditing.value = false
      avatarFile.value = null
      avatarPreview.value = null

      console.log('Profile update complete, attempting to show success toast')
      try {
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
          variant: "default",
          duration: 5000,
        })
        console.log('Success toast function called without errors')
      } catch (toastError) {
        console.error('Error calling success toast function:', toastError)
      }
    } else {
      console.error('No data returned from update operation')
      throw new Error('No data returned from update operation')
    }
  } catch (error) {
    console.error('Error in saveChanges:', error)
    errorMessage.value = error instanceof Error ? error.message : 'Error updating profile'

    console.log('Profile update failed, attempting to show error toast')
    try {
      toast({
        title: "Update Failed",
        description: errorMessage.value,
        variant: "destructive",
        duration: 5000,
      })
      console.log('Error toast function called without errors')
    } catch (toastError) {
      console.error('Error calling error toast function:', toastError)
    }
  }
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
    <CardHeader>
      <div class="flex items-start justify-between">
        <div class="flex items-center space-x-6">
          <div class="relative">
            <Avatar class="h-24 w-24">
              <AvatarImage :src="isEditing ? (avatarPreview || user.avatarUrl || '/api/placeholder/400/320') : (user.avatarUrl || '/api/placeholder/400/320')" />
              <AvatarFallback class="text-2xl">{{ user.username.substring(0, 2).toUpperCase() }}</AvatarFallback>
            </Avatar>
            <div v-if="isEditing" class="absolute bottom-0 right-0">
              <label for="avatar-upload" class="cursor-pointer">
        <span class="bg-primary text-primary-foreground rounded-full p-2 inline-block">
          <Icon icon="radix-icons:pencil-2" class="w-4 h-4" />
        </span>
              </label>
              <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleAvatarChange"
              >
            </div>
          </div>
          <div class="flex-grow">
            <div class="flex items-center mb-2">
              <CardTitle v-if="!isEditing" class="text-3xl font-bold mr-4">@{{ user.username }}</CardTitle>
              <Input v-if="isEditing" v-model="tempUser.username" class="text-2xl mr-4" placeholder="Username" />
              <Badge v-if="!isEditing" variant="default" class="bg-purple-500">PRO</Badge>
            </div>
            <div class="flex items-center mt-2">
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
              <Button v-if="!isCurrentUserProfile && !isEditing" variant="link" size="sm" @click="toggleFollow" class="ml-4">
                <Icon :icon="isFollowing ? 'radix-icons:minus-circled' : 'radix-icons:plus-circled'" class="mr-2 h-4 w-4" />
                {{ isFollowing ? 'Unfollow' : 'Follow' }}
              </Button>
            </div>
          </div>
        </div>
        <div class="flex space-x-2">
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
      </div>
    </CardHeader>
    <CardContent class="flex-grow flex flex-col justify-between">
      <div>
        <p v-if="!isEditing" class="text-sm text-gray-500 dark:text-gray-400">{{ user.bio }}</p>
        <div v-else class="relative">
          <Textarea
              v-model="tempUser.bio"
              class="mt-1"
              placeholder="Bio"
              :maxlength="BIO_MAX_LENGTH"
              rows="4"
          />
          <div class="absolute bottom-2 right-2 text-xs text-gray-400">
            {{ bioCharCount }}/{{ BIO_MAX_LENGTH }}
          </div>
        </div>

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