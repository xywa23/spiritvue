<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const isOpen = ref(true)

const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}

// Dummy chat data
const messages = ref([
  { id: 1, user: 'SpiritMaster', text: 'Hey everyone! Just won a game against level 6 Brandenburg-Prussia!' },
  { id: 3, user: 'SpiritMaster', text: 'Serpent Slumbering Beneath the Island and Thunderspeaker. It was intense!' },
])

const newMessage = ref('')

const sendMessage = () => {
  if (newMessage.value.trim()) {
    messages.value.push({
      id: messages.value.length + 1,
      user: 'You',
      text: newMessage.value.trim()
    })
    newMessage.value = ''
  }
}
</script>

<template>
  <div class="fixed top-[60px] right-0 bottom-0 w-[300px] transition-transform duration-300 ease-in-out z-[1000]"
       :class="{ 'translate-x-full': !isOpen }">
    <Button @click="toggleSidebar"
            class="absolute -left-[30px] top-[10px]">
      {{ isOpen ? '>' : '<' }}
    </Button>
    <Card v-if="isOpen" class="w-full h-full flex flex-col">
      <CardHeader>
        <CardTitle>Spirit Island Chat</CardTitle>
      </CardHeader>
      <CardContent class="flex-grow overflow-y-auto">
        <div class="space-y-4">
          <div v-for="message in messages" :key="message.id" class="bg-accent rounded p-2">
            <div class="font-bold">{{ message.user }}</div>
            <div>{{ message.text }}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <form @submit.prevent="sendMessage" class="flex w-full">
          <Input v-model="newMessage" placeholder="Type a message..." class="flex-grow mr-2" />
          <Button type="submit">Send</Button>
        </form>
      </CardFooter>
    </Card>
  </div>
</template>