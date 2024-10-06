<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const email = ref('')
const password = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  if (!email.value || !password.value) {
    alert('Please enter both email and password')
    return
  }

  isLoading.value = true

  try {
    // Here you would typically call your authentication service
    // For example: await authService.login(email.value, password.value)
    console.log('Logging in with:', { email: email.value, password: password.value })

    // Simulate an API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Handle successful login (e.g., redirect to dashboard)
    console.log('Login successful')
  } catch (error) {
    // Handle login error
    console.error('Login failed:', error)
    alert('Login failed. Please try again.')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex justify-center items-center bg-background">
    <Card class="w-[350px]">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleLogin">
          <div class="grid w-full items-center gap-4">
            <div class="flex flex-col space-y-1.5">
              <Label for="email">Email</Label>
              <Input id="email" v-model="email" type="email" placeholder="Your email address" />
            </div>
            <div class="flex flex-col space-y-1.5">
              <Label for="password">Password</Label>
              <Input id="password" v-model="password" type="password" placeholder="Your password" />
            </div>
          </div>
          <Button class="w-full mt-6" type="submit" :disabled="isLoading">
            {{ isLoading ? 'Logging in...' : 'Login' }}
          </Button>
        </form>
      </CardContent>
      <CardFooter class="flex justify-center">
        <p class="text-sm text-muted-foreground">
          Don't have an account?
          <router-link to="/signup" class="text-primary hover:underline">Sign up</router-link>
        </p>
      </CardFooter>
    </Card>
  </div>
</template>