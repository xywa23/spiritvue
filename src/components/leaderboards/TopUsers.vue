<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

type User = {
  id: string;
  username: string;
  totalGames: number;
  totalScore: number;
  averageScore: number;
}

const users = ref<User[]>([
  { id: '1', username: 'SpiritMaster', totalGames: 50, totalScore: 4500, averageScore: 90 },
  { id: '2', username: 'IslandDefender', totalGames: 45, totalScore: 3960, averageScore: 88 },
  { id: '3', username: 'NatureSavior', totalGames: 55, totalScore: 4675, averageScore: 85 },
  { id: '4', username: 'ElementalGuru', totalGames: 40, totalScore: 3360, averageScore: 84 },
  { id: '5', username: 'DahanWhisperer', totalGames: 60, totalScore: 4980, averageScore: 83 },
  { id: '6', username: 'BlightBuster', totalGames: 35, totalScore: 2870, averageScore: 82 },
  { id: '7', username: 'InvaderNemesis', totalGames: 48, totalScore: 3888, averageScore: 81 },
  { id: '8', username: 'PowerCardPro', totalGames: 42, totalScore: 3360, averageScore: 80 },
  { id: '9', username: 'FearTactician', totalGames: 38, totalScore: 2964, averageScore: 78 },
  { id: '10', username: 'ScenicExplorer', totalGames: 52, totalScore: 3952, averageScore: 76 },
])
</script>

<template>
  <Card class="w-full">
    <CardHeader>
      <CardTitle>Top Users This Week</CardTitle>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rank</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Total Games</TableHead>
            <TableHead>Total Score</TableHead>
            <TableHead>Average Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(user, index) in users" :key="user.id">
            <TableCell>{{ index + 1 }}</TableCell>
            <TableCell>{{ user.username }}</TableCell>
            <TableCell>{{ user.totalGames }}</TableCell>
            <TableCell>{{ user.totalScore }}</TableCell>
            <TableCell>{{ user.averageScore.toFixed(2) }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  </Card>
</template>