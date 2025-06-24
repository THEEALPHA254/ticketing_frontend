/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'
import { routes } from 'vue-router/auto-routes'
import HomeVue from "@/pages/index.vue";
import configs from './routes/configs';



import {
  isUserLoggedIn,
  getUserData,
  getHomeRouteForLoggedInUser,
} from "@/auth/utils";
import { globalStore } from "@/stores/globalStore";

// import configs from "./routes/configs";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeVue,
      meta: {
        requireLogin: true,
        title: "Home",
        breadCrumb: [{ text: "Home", to: { name: "home" }, active: true }],
      },
    },

     ...configs,
  ]
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})


router.beforeEach((to, _, next) => {
  const isLoggedIn = isUserLoggedIn();
  const g_Store = globalStore();

  // Redirect to login if not logged in
  // if (!isLoggedIn && to.meta.requireLogin == true)
  //   return next({ name: "login" });

  // Redirect if logged in
  if (to.meta.redirectIfLoggedIn && isLoggedIn) {
    const userData = getUserData();
    next({ name: "home" });
  }

  if (to.meta.authorize) {
    if (
      to.meta.authorize.length &&
      !to.meta.authorize.includes(g_Store.getUserData().user_type)
    ) {
      console.log("not authorized");
      return next({ name: "home" });
    }
  }
  return next();
});

export default router
