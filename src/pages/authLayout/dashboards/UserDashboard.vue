<template>
    <div>
        user dshboard view
    </div>

</template>
<script setup>
import { ref, reactive, onMounted, watch, computed} from 'vue';
import LoadingSpinnerVue from '@/components/LoadingSpinner.vue';
import { globalStore } from '@/stores/globalStore'
import { Form, Field, ErrorMessage } from 'vee-validate';
import { useRoute, useRouter } from 'vue-router'
import axiosInst from '@/services/api'
import {toast} from "vue-sonner"
import { AuthStore } from '@/stores/authStore'
import DeleteModal from '@/components/DeleteModal.vue';


const auth_store = AuthStore();
const route = useRoute()
const router = useRouter();
const g_Store = globalStore()
const emit = defineEmits([''])

const props = defineProps({

});

const currentRouteName = computed(() => {
  return route.meta.title;
});

</script>
<style scoped>

</style>
