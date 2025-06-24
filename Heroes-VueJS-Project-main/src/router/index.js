import Vue from 'vue'
import VueRouter from 'vue-router'
import HomePage from "@/components/HomePage.vue";
import AuthenticateView from "@/components/AuthenticateView.vue";
import LocationList from "@/components/LocationList.vue";
import LocationDetail from "@/components/LocationDetail.vue";
import ModeList from "@/components/ModeList.vue";
import ModeDetail from "@/components/ModeDetail.vue";
import LineList from "@/components/LineList.vue";
import LineDetail from "@/components/LineDetail.vue";
import StopList from "@/components/StopList.vue";
import StopDetail from "@/components/StopDetail.vue";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'home',
        components: {
            central: HomePage
        },
    },
    {
        path: '/locations',
        name: 'locations',
        components: {
            central: LocationList
        }
    },
    {
        path: '/locations/:id',
        name: 'locationById',
        components: {
            central: LocationDetail
        }
    },
    {
        path: '/modes',
        name: 'modes',
        components: {
            central: ModeList
        }
    },
    {
        path: '/modes/:id',
        name: 'modeById',
        components: {
            central: ModeDetail
        }
    },
    {
        path: '/lines',
        name: 'lines',
        components: {
            central: LineList
        }
    },
    {
        path: '/lines/:id',
        name: 'lineById',
        components: {
            central: LineDetail
        }
    },
    {
        path: '/stops',
        name: 'stops',
        components: {
            central: StopList
        }
    },
    {
        path: '/stops/:id',
        name: 'stopById',
        components: {
            central: StopDetail
        }
    },
    {
        path: '/authenticate',
        name: 'authenticate',
        components: {
            central: AuthenticateView
        }
    }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
