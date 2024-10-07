<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {supabase} from "@/lib/supabase.ts";
import { useRouter } from 'vue-router'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const handleSignUp = async () => {
  if (!name.value || !email.value || !password.value || !confirmPassword.value) {
    errorMessage.value = 'Please fill in all fields'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          full_name: name.value,
        }
      }
    })

    if (error) throw error

    console.log('Registration successful', data)
    router.push('/login')
  } catch (error) {
    console.error('Registration failed:', error)
    errorMessage.value = error instanceof Error ? error.message : 'Registration failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex justify-center items-center bg-background">
    <Card class="w-[350px]">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Create a new account to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleSignUp">
          <div class="grid w-full items-center gap-4">
            <div class="flex flex-col space-y-1.5">
              <Label for="name">Name</Label>
              <Input id="name" v-model="name" type="text" placeholder="Your full name" />
            </div>
            <div class="flex flex-col space-y-1.5">
              <Label for="email">Email</Label>
              <Input id="email" v-model="email" type="email" placeholder="Your email address" />
            </div>
            <div class="flex flex-col space-y-1.5">
              <Label for="password">Password</Label>
              <Input id="password" v-model="password" type="password" placeholder="Choose a password" />
            </div>
            <div class="flex flex-col space-y-1.5">
              <Label for="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" v-model="confirmPassword" type="password" placeholder="Confirm your password" />
            </div>
          </div>
          <p v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>
          <Button class="w-full mt-6" type="submit" :disabled="isLoading">
            {{ isLoading ? 'Signing up...' : 'Sign Up' }}
          </Button>
        </form>
      </CardContent>
      <CardFooter class="flex justify-center">
        <p class="text-sm text-muted-foreground">
          Already have an account?
          <router-link to="/login" class="text-primary hover:underline">Log in</router-link>
        </p>
      </CardFooter>
    </Card>
  </div>
</template>