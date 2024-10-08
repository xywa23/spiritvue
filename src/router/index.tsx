import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import UserProfile from "@/components/user/main.vue";
import Login from "@/components/login.vue";
import SignUp from "@/components/signUp.vue";
import Leaderboards from "@/components/leaderboards/main.vue";


const routes: Array<RouteRecordRaw> = [
    {
        path: '/leaderboards',  // Add new route for Table component
        name: 'Leaderboards',
        component: Leaderboards
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