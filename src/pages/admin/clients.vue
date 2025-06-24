<template>
    <v-card>
        <v-card-text>
            <div class="d-flex justify-end mt-4">
                <Crud
                ref="myFolderCrudRef"
                :modal_width="'align-dialog'"
                :name="'Clients'"
                :icon="'mdi-account-outline'"
                :field_width="'6'"
                :field_width_small="'12'"
                :fields="form_fields"
                @submitForm="submitCreateItem"
                @editForm="editSubmitItem"
                :variant_="'outlined'"
                >

                </Crud>

            </div>
           <div>
                <v-data-table
                :headers="headers"
                :items="state.users"
                item-key="name"
                show-select
                item-value="id"
                :loading="state.is_loading"
                class="elevation-0"
                >

                <template v-slot:item.actions="{ item }">
                    <v-icon
                        size="small"
                        class="mr-4"
                        @click="viewUser(item)"
                        >
                        mdi-eye
                    </v-icon>
                    <v-icon
                        size="small"
                        class="mr-4"
                        @click="editUser(item)"
                        >
                        mdi-pencil
                    </v-icon>
                    <v-icon
                        size="small"
                        class="mr-4"
                        @click="$refs.deleteModalRef.showModal(item)"
                    >
                        mdi-delete
                    </v-icon>
                
                    </template>
                </v-data-table>
            </div> 
        </v-card-text>
    </v-card>
    

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
import Crud from '@/components/Crud.vue';


const auth_store = AuthStore();
const route = useRoute()
const router = useRouter();
const g_Store = globalStore()
const emit = defineEmits([''])

const props = defineProps({

});

let myFolderCrudRef = ref(null)

let state = ref ({
    users : [],
    is_loading : false,

})

const headers = [
    {title: "Username", value: "username", sortable: true},
    {title: "First Name", value: "first_name", sortable: true},
    {title: "Last Name", value: "last_name", sortable: true},
    {title: "Email", value: "email", sortable: true},
    {title: "Actions", value: "actions"}
   
]

const form_fields = computed (() => [
  { text: "Username", value: "username", type: "text", required: true},
  { text: "First Name", value: "first_name", type: "text", required: true},
  { text: "Last Name", value: "last_name", type: "text", required: true},
  { text: "Email", value: "email", type: "text", required: true},
])

function editUser(item){
  myFolderCrudRef.value.editThisItem(item)
}

function fetchUsers (){
  state.value.is_loading = true;

  axiosInst.get(`/users/${g_Store.getUserData().id}/`)
  .then((response) => {
    state.value.users = response.data

    console.log("users", state.value.users)
    state.value.is_loading = false;
  })
  .catch((error) => {
    console.log(error);
    state.value.is_loading = false;

  })
}

onMounted (() => {
    fetchUsers()
})


const submitCreateItem = (values) => {
    console.log(values);
    const formData = {
    username: values.data.username,
    first_name: values.data.first_name,
    last_name: values.data.last_name,
    email: values.data.email,
    password: values.data.password,

  }
 
    console.log(formData);
   
    axiosInst.post(`/register/`, formData)
        .then((response) => {
        toast.success('User created successfully');

        fetchUsers();
        values.callback();
    })
        .catch((error) => {
        console.log(error);
        toast.error('Error creating User');

        values.callback();
    });
};

const currentRouteName = computed(() => {
  return route.meta.title;
});



</script>
<style scoped>

</style>
