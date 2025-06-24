<template>
  <div>
    <div v-if="g_Store.isAdmin()">
      <AdminDashboard />
    </div>

    <div v-if="g_Store.isUser()">
      <UserDashboard/>
    </div>

    <div v-if="g_Store.isSuperAdmin()" >
      <SuperDashboard />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, onUnmounted } from 'vue';
import { AuthStore } from "@/stores/authStore";
import { globalStore } from "@/stores/globalStore";
import { useRoute, useRouter } from 'vue-router'
import axiosInst, { baseURL } from '@/services/api'
import { Toaster, toast } from 'vue-sonner'
import UserDashboard from './authLayout/dashboards/UserDashboard.vue';
import AdminDashboard from './authLayout/dashboards/AdminDashboard.vue';
import SuperDashboard from './authLayout/dashboards/SuperDashboard.vue';

const route = useRoute()
const router = useRouter();
const store = AuthStore();
const g_Store = globalStore();


</script>
