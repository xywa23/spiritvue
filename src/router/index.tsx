import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import UserProfile from "@/components/user/main.vue";
import Login from "@/components/login.vue";
import SignUp from "@/components/signUp.vue";
import Leaderboards from "@/components/leaderboards/main.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/leaderboards',
        name: 'Leaderboards',
        component: Leaderboards
    },
    {
        path: '/user-profile/:identifier',
        name: 'UserProfile',
        component: UserProfile,
        props: true
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/signup',
        name: 'SignUp',
        component: SignUp
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router