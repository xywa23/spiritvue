import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Table from '@/Table.vue'  // Import the Table component
import UserProfile from "@/UserProfile.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/table',  // Add new route for Table component
        name: 'Table',
        component: Table
    },
    {
        path: '/user-profile',  // Add new route for Table component
        name: 'UserProfile',
        component: UserProfile
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router