
<template>
  <div 
  style="
  display: flex;
  flex-direction: column;
  height: 99vh; width: 99vw;
  overflow-y: hidden;
  overflow-x: hidden;
  background: url('https://app.essaypro.com/auth-banner-text-bg-light.0563f7d3004ff083.svg');
  background-size: cover;
  "
  >

  <v-row class="mt-10">
    <v-col cols="12" md="4" offset-md="4">
      <v-card
      rounded="lg"
      class="mx-4 "
      elevation="0"

      >
        <v-card-title>
          <div class="text-subtitle-2 font-weight-bold">
            Sign in to your account
          </div>
        </v-card-title>
        <v-card-text>
          <v-row class="mt-4">
            <v-col cols="12">
              <div class="my-3 text-subtitle-2">
                Username
              </div>
              <v-text-field placeholder="Username" density="compact" v-model="formValues.username"
                variant="outlined"
                hide-details
                required autofocus>
              </v-text-field>
            </v-col>
            <v-col cols="12" class="mt-2">
              <div class="text-subtitle-2 my-2 d-flex justify-space-between"
              >
                <div>Password</div>
                <div @click="forgotPass" class="text-caption text-info cursor-pointer">Forgot Password?</div>
              </div>
              <v-text-field placeholder="Password" density="compact" variant="outlined"
                  v-model="formValues.password"
                  :append-inner-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" :type="show1 ? 'text' : 'password'" @click:append-inner="show1=!show1"
                  name="input-10-1" hint="At least 8 characters" counter
                  >
                </v-text-field>
            </v-col>

            <v-col cols="12" class="mb-5">
              <v-btn :loading="is_submiting"
              @click="login" 
              color="black"
              style="font-size: 12px;"
              variant="flat"
              block class="mt-4">
                      Sign In
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  </div>

  <Toaster position="bottom-right" />





</template>



<script setup>
import { ref, reactive, onMounted } from 'vue';
import { getHomeRouteForLoggedInUser } from '@/auth/utils'
import { AuthStore } from '@/stores/authStore'
import { Form, Field, ErrorMessage } from 'vee-validate';
import { globalStore } from '@/stores/globalStore'
import axiosIns from '@/services/api'
import TokenService from '@/core/auth/jwt/tokenService';
import { PermissionStore } from '@/stores/permissions'
import { useRoute, useRouter } from 'vue-router'
import { Toaster, toast } from 'vue-sonner'

const route = useRoute()
const router = useRouter();

let status = ref('')
let formValues = ref({
  username: '',
  password: '',
})

let is_submiting = ref(false)
let show1 = ref(false)
let show2 = ref(true)

const forgotPass = () => {
  router.push({ name: 'forgot-password'})
}

const onInvalidSubmit = ({ values, errors, results }) => {
  for (const key in errors) {
    toast.error(`Field ${errors[key]}`, {
      timeout: 2500,
    });
  }

}

const login = () => {

  // // confirm first that both fields are not empty
  // if (formValues.value.username == '' || formValues.value.password == '') {
  //   toast.error("All fields are required", {
  //     timeout: 2000,
  //   });
  //   return
  // }
  // disable button
  is_submiting.value = true

  axiosIns.post('/login/' , {
    username: formValues.value.username,
    password: formValues.value.password,
  })
    .then(response => {

      const store = AuthStore()
      const permissions = PermissionStore()

      const userData = response.data
      localStorage.setItem('userData', JSON.stringify(userData))
      store.updateIsLoggedInToTrue()

      router.replace({ name: 'home' })
        .then(() => {
          toast.success(`Welcome back ${userData.first_name}.`, {
            timeout: 2000,
          });
        })

      // remove spinner and from sign in button
      is_submiting.value = false
    })
    .catch(error => {
      console.log(error);
      if (error.code == "ERR_NETWORK") {
        toast.error("Network Error. Try again later", {
          timeout: 3000,
        });
      }
      else {
        toast.error("Invalid login. Try again", {
          timeout: 3000,
        });
      }

      is_submiting.value = false
    })

}

</script>



<style scoped>
.auth-container {
  display: flex;
  justify-content: space-between;
  height: 90vh;
  overflow-y: hidden!important;
  border-radius: 20px;
}


.auth-page{
  background-color: #FCFBFD;
  border-radius: 20px 250px 40px 20px;
}

.login-form {
  justify-content: center;
  /* border: 2px solid #C2D5EB; */
  border-radius: 20px;
}


.login-container {
  height: 100vh;
}

.auth-image {
  /* background: rgba(0,0,0,0.05) url("https://images.pexels.com/photos/2536965/pexels-photo-2536965.jpeg?auto=compress&cs=tinysrgb&w=1600"); */
  /* background: rgba(0,0,0,0.01) url("https://images.pexels.com/photos/5632381/pexels-photo-5632381.jpeg?auto=compress&cs=tinysrgb&w=1600"); */
  /* background: rgba(0,0,0,0.3) url("https://images.pexels.com/photos/5650020/pexels-photo-5650020.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"); */
  /* background: rgba(0,0,0,0.01) url("https://images.pexels.com/photos/6214480/pexels-photo-6214480.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"); */
  background: rgba(0,0,0,0.05) url("https://images.pexels.com/photos/5872357/pexels-photo-5872357.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load");
  background-blend-mode: darken;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}

.education-img {
  height: 100%;
  width: 100%;
}

:deep .v-text-field .v-field--no-label input, .v-text-field .v-field--active input {
    opacity: 1;
    font-size: 12px;
}

:deep .mdi:before {
  font-size: 13px;
}
</style>



