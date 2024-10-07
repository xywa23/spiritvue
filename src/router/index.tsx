import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Table from '@/components/table.vue'  // Import the Table component
import UserProfile from "@/components/userProfile.vue";
import Login from "@/components/login.vue";
import SignUp from "@/components/signUp.vue";

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
    },
    {
        path: '/login',  // Add new route for Table component
        name: 'Login',
        component: Login
    },
    {
        path: '/signup',  // Add new route for Table component
        name: 'SignUp',
        component: SignUp
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router