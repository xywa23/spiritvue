import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Table from '@/Table.vue'  // Import the Table component

const routes: Array<RouteRecordRaw> = [
    {
        path: '/table',  // Add new route for Table component
        name: 'Table',
        component: Table
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router