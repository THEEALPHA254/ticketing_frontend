<template>
  
  <v-app id="inspire" v-if="store.loggedIn">
    <v-navigation-drawer v-model="drawer">

      <!-- top part of the drawer -->
      
      <template v-slot:prepend>
          <div class="mt-4 d-flex align-center justify-start ml-10">
            <h3>
              <!-- <v-icon class="mr-4">mdi-whatsapp</v-icon> -->
              Company Name
            </h3>
          </div>
      </template>
      

      <!-- menu option -->

      <Submenu />

      <!-- end of menu option -->

      
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

    

      <v-spacer></v-spacer>
      
      <div
      style="
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: grey;
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      "
      class="mr-5"
      @click="manageClientModal"
      >
      {{returnActiveClientFirstLetter()}}
      </div>

    </v-app-bar>

    <v-main class="mt-6 bg-grey-lighten-3" id="content">
      <div class="px-5">
        <router-view />

      </div>
    </v-main>


     <!-- modal -->
      <v-dialog v-model="g_Store.state.logoutModal" content-class="align-dialog-smallest"
        transition="dialog-top-transition"
        max-width="500"
        >
        <v-card class=" pt-3 pb-4 text-center ">
          <v-card-title class="text-center">
            Confirm Logout

            <v-btn class="float-right" variant="flat" icon size="small" dark @click="g_Store.state.logoutModal = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>

          </v-card-title>
          <v-divider></v-divider>

          <v-card-text>
              <div>
                <v-icon icon="mdi-logout" size="40"></v-icon>
              </div>
              <div class="text-subtitle-2 mt-10">
                Are you sure you want to log out?
              </div>

              <v-row class="mt-4">
                <v-col md="12">
                  <v-btn block :loading="state.logout_is_loading"  variant="outlined" @click="executeLogout">
                <v-icon icon="mdi-logout" class="mr-2"></v-icon> Logout
              </v-btn>
                </v-col>
              </v-row>


          </v-card-text>

        </v-card>
      </v-dialog>


      <v-dialog v-model="state.client_modal" content-class="align-dialog-smallest"
        transition="dialog-top-transition" max-width="500">
        <v-card class=" pt-3 pb-4">
          <v-card-title class="text-center">
            <span class="text-subtitle-2">Hello {{ g_Store.getUserData().first_name }}</span>

            <v-btn class="float-right" variant="flat" icon size="small" @click="state.client_modal = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>

          </v-card-title>

          <v-card-text>
            
            <p class="text-caption text-center">
              You are currently logged in as {{ g_Store.getUserData().first_name }} {{ g_Store.getUserData().last_name }}
            </p>

            <p class="text-caption text-center text-disabled mt-5">
              {{ g_Store.getUserData().email }}
            </p>
              


          </v-card-text>

        </v-card>
      </v-dialog>
            
  </v-app>

  <ForgotPassword v-else-if="currentRouteName == 'Forgot Password'" />


  <AuthLayout v-else />


  <Toaster position="bottom-right" closeButton />

  
</template>

<script setup>
import { ref } from 'vue'
import Submenu from '@/layouts/Submenu.vue';
import { AuthStore } from '@/stores/authStore';
import { globalStore } from '@/stores/globalStore'
import { useRoute, useRouter } from 'vue-router'
import AuthLayout from '@/pages/authLayout/AuthLayout.vue';
import { Toaster, toast } from 'vue-sonner'
import ForgotPassword from '@/pages/authLayout/ForgotPassword.vue';

const store = AuthStore()
const g_Store = globalStore()
const route = useRoute()
const drawer = ref(null)


let state = ref({
  logout_is_loading: false,
  is_submiting: false,
  overlay: false,
  client_modal: false,
})



function executeLogout() {
  // Check if userData exists before executing the logout logic
  g_Store.hideLogoutModal();
  store.logout();
}


function manageClientModal() {
  state.value.client_modal = true;  
}

function getFirstLetter(name) {
  return name.charAt(0).toUpperCase();
}

function returnActiveClientFirstLetter() {
  const activeClient = g_Store.getUserData().first_name
  return activeClient ? getFirstLetter(activeClient) : 'S';
}


function selectClient(client) {
    let userData = g_Store.getUserData();
    userData.client = client.id;
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('selectedClient', JSON.stringify(client)); // Store the active client ID

    toast.success(`Switched Client to ${client.client_name}`);

    g_Store.state.flip_changed_client = !g_Store.state.flip_changed_client; // Flip the value to trigger a re-fetch of the client's data
    // close the modal
    state.value.client_modal = false;
}


const currentRouteName = computed(() => {
  return route.meta.title;
})


</script>

<style scoped>
:deep .v-list-group__items .v-list-item {
  /* padding-inline-start: 40px!important; */
  padding-inline-start: calc(0px + var(--indent-padding)) !important;
}

:deep .settitlefont>.v-list-item__content>.v-list-item-title {
  font-size: 0.8925rem !important;
}
</style>