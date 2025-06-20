/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'
import "./assets/main.css";
import setupInterceptors from "./core/auth/jwt/jwtService";
// Components
import "./core/validators/validators";

import App from './App.vue'
import { PermissionStore } from "@/stores/permissions";

// Composables
import { createApp } from 'vue'

const app = createApp(App)


registerPlugins(app)
setupInterceptors();

const permissions = PermissionStore();
app.mount('#app')
