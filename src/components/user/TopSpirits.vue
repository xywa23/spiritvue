<script setup lang="ts">
import {  computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Icon } from '@iconify/vue'

const allSpirits = [
  { name: 'Lightning\'s Swift Strike', icon: 'tabler:bolt', color: 'yellow' },
  { name: 'River Surges in Sunlight', icon: 'tabler:ripple', color: 'blue' },
  { name: 'Shadows Flicker Like Flame', icon: 'tabler:shadow', color: 'gray' },
  { name: 'Vital Strength of the Earth', icon: 'tabler:world-latitude', color: 'green' },
  { name: 'A Spread of Rampant Green', icon: 'tabler:plant-2', color: 'green' },
  { name: 'Thunderspeaker', icon: 'tabler:swords', color: 'yellow' },
  { name: 'Bringer of Dreams and Nightmares', icon: 'tabler:moon', color: 'gray' },
  { name: 'Ocean\'s Hungry Grasp', icon: 'tabler:droplet', color: 'blue' },
  { name: 'Keeper of the Forbidden Wilds', icon: 'tabler:leaf', color: 'green' },
  { name: 'Sharp Fangs Behind the Leaves', icon: 'tabler:paw', color: 'red' },
  { name: 'Heart of the Wildfire', icon: 'tabler:flame', color: 'red' },
  { name: 'Serpent Slumbering Beneath the Island', icon: 'tabler:spiral', color: 'grape' },
  { name: 'Grinning Trickster Stirs Up Trouble', icon: 'tabler:mood-crazy-happy', color: 'orange' },
  { name: 'Lure of the Deep Wilderness', icon: 'tabler:prism', color: 'yellow' },
  { name: 'Many Minds Move as One', icon: 'tabler:bat', color: 'gray' },
  { name: 'Shifting Memory of Ages', icon: 'tabler:brain', color: 'green' },
  { name: 'Stone\'s Unyielding Defiance', icon: 'tabler:diamond', color: 'gray' },
  { name: 'Volcano Looming High', icon: 'tabler:mountain', color: 'red' },
  { name: 'Shroud of Silent Mist', icon: 'tabler:grave', color: 'gray' },
  { name: 'Vengeance as a Burning Plague', icon: 'tabler:biohazard', color: 'orange' },
  { name: 'Fractured Days Split the Sky', icon: 'tabler:infinity', color: 'cyan' },
  { name: 'Starlight Seeks Its Form', icon: 'tabler:sparkles', color: 'grape' },
  { name: 'Downpour Drenches the World', icon: 'tabler:cloud-rain', color: 'grape' },
  { name: 'Finder of Paths Unseen', icon: 'tabler:feather', color: 'cyan' },
  { name: 'Devouring Teeth Lurk Underfoot', icon: 'tabler:tooth', color: 'yellow' },
  { name: 'Eyes Watch from the Trees', icon: 'tabler:eye', color: 'gray' },
  { name: 'Fathomless Mud of the Swamp', icon: 'tabler:bug', color: 'green' },
  { name: 'Rising Heat of Stone and Sand', icon: 'tabler:sun', color: 'red' },
  { name: 'Sun-Bright Whirlwind', icon: 'tabler:wind', color: 'yellow' },
  { name: 'Ember-Eyed Behemoth', icon: 'tabler:mountain', color: 'green' },
  { name: 'Hearth-Vigil', icon: 'tabler:dog', color: 'pink' },
  { name: 'Towering Roots of the Jungle', icon: 'tabler:trees', color: 'green' },
  { name: 'Breath of Darkness Down Your Spine', icon: 'tabler:skull', color: 'gray' },
  { name: 'Relentless Gaze of the Sun', icon: 'tabler:sun', color: 'yellow' },
  { name: 'Wandering Voice Keens Delirium', icon: 'tabler:ear', color: 'yellow' },
  { name: 'Wounded Waters Bleeding', icon: 'tabler:waves', color: 'red' },
  { name: 'Dances Up Earthquakes', icon: 'tabler:activity', color: 'pink' },
]

const topSpirits = computed(() => {
  return allSpirits.sort(() => 0.5 - Math.random()).slice(0, 3)
})

const getBackgroundColor = (color: string) => {
  const colorMap: Record<string, string> = {
    yellow: 'bg-yellow-400',
    blue: 'bg-blue-400',
    gray: 'bg-gray-400',
    green: 'bg-green-400',
    red: 'bg-red-400',
    grape: 'bg-purple-400',
    orange: 'bg-orange-400',
    cyan: 'bg-cyan-400',
    pink: 'bg-pink-400'
  }
  return colorMap[color] || 'bg-gray-200'
}
</script>

<template>
  <Card class="w-full">
    <CardHeader>
      <CardTitle>My Top 3 Spirits</CardTitle>
    </CardHeader>
    <CardContent>
      <div class="flex justify-around">
        <div v-for="spirit in topSpirits" :key="spirit.name" class="flex flex-col items-center">
          <div :class="['rounded-full p-3 mb-2', getBackgroundColor(spirit.color)]">
            <Icon :icon="spirit.icon" class="h-8 w-8" />
          </div>
          <span class="text-sm text-center max-w-[120px]">{{ spirit.name }}</span>
        </div>
      </div>
    </CardContent>
  </Card>
</template>