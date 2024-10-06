<script setup lang="ts">
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'


// Updated game results data
const gameResults = [
  {
    user: 'Player1',
    date: '2024-10-05',
    spirits: 'Thunderspeaker, Vital Strength of the Earth',
    terrorLevel: 2,
    islandState: 'Healthy',
    result: 'Victory',
    fun: 9,
    adversary: 'Brandenburg-Prussia',
    scenario: 'Blitz',
    difficulty: 7,
    score: 65,
  },
  {
    user: 'Player2',
    date: '2024-10-04',
    spirits: 'Ocean\'s Hungry Grasp',
    terrorLevel: 3,
    islandState: 'Ravaged',
    result: 'Defeat',
    fun: 7,
    adversary: 'England',
    scenario: 'Guard the Isle\'s Heart',
    difficulty: 6,
    score: 42,
  },
  {
    user: 'Player1',
    date: '2024-10-05',
    spirits: 'Thunderspeaker, Vital Strength of the Earth',
    terrorLevel: 2,
    islandState: 'Healthy',
    result: 'Victory',
    fun: 9,
    adversary: 'Brandenburg-Prussia',
    scenario: 'Blitz',
    difficulty: 7,
    score: 65,
  },
  {
    user: 'Player2',
    date: '2024-10-04',
    spirits: 'Ocean\'s Hungry Grasp',
    terrorLevel: 3,
    islandState: 'Ravaged',
    result: 'Defeat',
    fun: 7,
    adversary: 'England',
    scenario: 'Guard the Isle\'s Heart',
    difficulty: 6,
    score: 42,
  },
  // Add more game results as needed
]
</script>

<template>
  <div>
    <Table>
      <TableCaption>Spirit Island Game Results</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Spirits</TableHead>
          <TableHead>Terror Level</TableHead>
          <TableHead>Island State</TableHead>
          <TableHead>Result</TableHead>
          <TableHead>Fun</TableHead>
          <TableHead>Adversary</TableHead>
          <TableHead>Scenario</TableHead>
          <TableHead>Difficulty</TableHead>
          <TableHead>Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="result in gameResults" :key="result.user + result.date">
          <TableCell>{{ result.user }}</TableCell>
          <TableCell>{{ result.date }}</TableCell>
          <TableCell>{{ result.spirits }}</TableCell>
          <TableCell>{{ result.terrorLevel }}</TableCell>
          <TableCell>{{ result.islandState }}</TableCell>
          <TableCell>
            <Badge>
              {{ result.result }}
            </Badge>
          </TableCell>
          <TableCell>{{ result.fun }}/10</TableCell>
          <TableCell>{{ result.adversary }}</TableCell>
          <TableCell>{{ result.scenario }}</TableCell>
          <TableCell>{{ result.difficulty }}/10</TableCell>
          <TableCell>{{ result.score }}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>