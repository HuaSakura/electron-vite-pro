import {createRouter, createWebHashHistory, Router} from 'vue-router'

const routes: any[] = [
    {
        path: '/',
        redirect: '/index'
    },
    {
        path: '/index',
        name: 'index',
        component: () => import('../views/index.vue')
    },
    {
        path: '/setting',
        name: 'setting',
        component: () => import('../views/setting/setting.vue')
    },
    {
        path: '/faceCollection',
        name: 'faceCollection',
        component: () => import('../views/faceCollection.vue')
    },
    {
        path: '/weighingInterface',
        name: 'weighingInterface',
        component: () => import('../views/weighingInterface.vue')
    },
]

const router: Router = createRouter({
    history: createWebHashHistory(),
    routes
})


export default router
