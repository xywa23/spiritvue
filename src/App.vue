<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { RouterView } from 'vue-router'
import Header from "@/components/header.vue"
import Sidebar from "@/components/Sidebar.vue"
import { supabase } from '@/lib/supabase'
import type { Session } from '@supabase/supabase-js'

const session = ref<Session | null>(null)

onMounted(() => {
  console.log('App mounted')
  supabase.auth.getSession().then(({ data }) => {
    console.log('Initial session:', data.session)
    session.value = data.session
  })

  supabase.auth.onAuthStateChange((event, _session) => {
    console.log('Auth state changed:', event, _session)
    session.value = _session
  })
})

watch(session, (newSession) => {
  console.log('Session updated in App:', newSession)
})
</script>

<template>
  <div class="app">
    <Header :session="session" />
    <div>
      <main>
        <RouterView :session="session" />
      </main>
      <Sidebar />
    </div>
  </div>
</template>

<style scoped>
main {
  flex-grow: 1;
  padding: 1rem;
}
</style>