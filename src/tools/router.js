import Vue from "vue"
import Router from "vue-router"
import store from "@/tools/store"
import util from "@/tools/util"
import Home from "@/components/main/Home"
import News from "@/components/main/News"
import Classify from "@/components/main/Classify"
import Personal from "@/components/main/Personal"
import Opus from "@/components/Opus"
import Search from "@/components/Search"
import Picture from "@/components/Picture"

Vue.use(Router);

const router = new Router({
    routes: [
        {
            path: "/",
            redirect: "/home"
        },
        {
            path: "/home",
            name: "home",
            component: Home
        },
        {
            path: "/news",
            name: "news",
            component: News
        },
        {
            path: "/classify",
            name: "classify",
            component: Classify
        },
        {
            path: "/personal",
            name: "personal",
            component: Personal
        },
        {
            path: "/search/:content",
            name: "search",
            component: Search
        },
        {
            path: "/opus/",
            name: "opus",
            component: Opus
        },
        {
            path: "/picture/",
            name: "picture",
            component: Picture
        }
    ]
});

export default router;