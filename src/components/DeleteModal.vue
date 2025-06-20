<template>
    <v-dialog v-model="state.modal" content-class="align-dialog-smallest"
    >
        <v-card>
            <v-card-title class="text-subtitle-2 d-flex align-center justify-space-between">
                <span class="text-subtitle-2">
                    
                </span>

            </v-card-title>

            <v-card-text>

                <div class="d-flex justify-center align-center flex-column">
                    <v-icon icon="mdi-alert-circle-outline" 
                    size="90"
                    color="red-lighten-2"></v-icon>

                    <div class="text-h6 mt-4">
                        Are you sure?
                    </div>
                    <div class="text-caption mt-4">
                        This action cannot be undone.
                    </div>
                </div>
                
            </v-card-text>

            <v-card-actions
            class="mx-4"
            >
                <v-btn
                    color=""
                    @click="dismissModal"
                    variant="tonal"
                    size="small"
                >
                    No Cancel
                </v-btn>

                <v-spacer></v-spacer>

                <v-btn
                    color="error"
                    @click="confirmDelete"
                    variant="tonal"
                    size="small"
                >
                    Yes Delete
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
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


const auth_store = AuthStore();
const route = useRoute()
const router = useRouter();
const g_Store = globalStore()
const emit = defineEmits(['dismissModal', 'confirmDelete'])

const props = defineProps({

});

let state = ref({
    modal: false,
    instance: null,
})

const dismissModal = () => {
    state.value.modal = false
    emit('dismissModal')
}

function confirmDelete() {
    state.value.modal = false
    emit('confirmDelete', state.value.instance)
    
}


function showModal(instance) {
    state.value.modal = true
    state.value.instance = instance
}

defineExpose({
    showModal
})

const currentRouteName = computed(() => {
  return route.meta.title;
});

</script>
<style scoped>

</style>
