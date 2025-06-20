<template>
  <div>
    <div v-if="g_Store.isAdmin()">
      Admin Login.
    </div>

    <v-sheet v-else class="d-flex flex-column align-center justify-center text-subtitle-2 rounded-sm "
    style="height: 40vh;"
    >
      SuperAdmin Login.
    </v-sheet>
  </div>
</template>

<script setup>
import { onMounted, ref, onUnmounted } from 'vue';
import { AuthStore } from "@/stores/authStore";
import { globalStore } from "@/stores/globalStore";
import { useRoute, useRouter } from 'vue-router'
import axiosInst, { baseURL } from '@/services/api'
import { Toaster, toast } from 'vue-sonner'

const route = useRoute()
const router = useRouter();
const store = AuthStore();
const g_Store = globalStore();

</script>
