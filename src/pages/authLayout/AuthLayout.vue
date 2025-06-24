
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
      v-if="!isRegistering"
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

            <!-- Register Link -->
              <v-col cols="12" class="text-center mb-5">
                <span class="text-caption">Don't have an account?</span>
                <v-btn variant="text" color="primary" class="ml-1" style="font-size: 12px;" @click="isRegistering = true">
                  Register
                </v-btn>
              </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Register Card -->
        <v-card
          v-else
          rounded="lg"
          class="mx-4"
          elevation="0"
        >
          <v-card-title>
            <div class="text-subtitle-2 font-weight-bold">
              Register a new account
            </div>
          </v-card-title>
          <v-card-text>
            <v-row class="mt-4">
              <v-col cols="12">
                <div class="my-3 text-subtitle-2">
                  Username
                </div>
                <v-text-field placeholder="Username" density="compact" v-model="registerForm.username"
                  variant="outlined"
                  hide-details
                  required>
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <div class="my-3 text-subtitle-2">
                  First Name
                </div>
                <v-text-field placeholder="First Name" density="compact" v-model="registerForm.first_name"
                  variant="outlined"
                  hide-details
                  required>
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <div class="my-3 text-subtitle-2">
                  Last Name
                </div>
                <v-text-field placeholder="Last Name" density="compact" v-model="registerForm.last_name"
                  variant="outlined"
                  hide-details
                  required>
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <div class="my-3 text-subtitle-2">
                  Email
                </div>
                <v-text-field placeholder="Email" density="compact" v-model="registerForm.email"
                  variant="outlined"
                  hide-details
                  required>
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <div class="my-3 text-subtitle-2">
                  Password
                </div>
                <v-text-field placeholder="Password" density="compact" variant="outlined"
                  v-model="registerForm.password"
                  :append-inner-icon="showRegPass ? 'mdi-eye' : 'mdi-eye-off'" :type="showRegPass ? 'text' : 'password'" @click:append-inner="showRegPass=!showRegPass"
                  required>
                </v-text-field>
              </v-col>
              <v-col cols="12" class="mb-2">
                <v-btn :loading="is_registering"
                  @click="register"
                  color="black"
                  style="font-size: 12px;"
                  variant="flat"
                  block class="mt-4">
                  Register
                </v-btn>
              </v-col>
              <!-- Back to Login Link -->
              <v-col cols="12" class="text-center mb-5">
                <span class="text-caption">Already have an account?</span>
                <v-btn variant="text" color="primary" class="ml-1" style="font-size: 12px;" @click="isRegistering = false">
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
import axiosInst from '@/services/api'
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

// Register state
let isRegistering = ref(false)
let is_registering = ref(false)
let showRegPass = ref(false)
let registerForm = ref({
  username: '',
  first_name: '',
  last_name: '',
  email: '',
  password: '',
})

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

  axiosInst.post('/login/' , {
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

// Register function
const register = () => {
  if (!registerForm.value.username || !registerForm.value.email || !registerForm.value.password) {
    toast.error("All fields are required", { timeout: 2000 });
    return;
  }
  is_registering.value = true;
  const formData = {
    username: registerForm.value.username,
    first_name: registerForm.value.first_name,
    last_name: registerForm.value.last_name,
    email: registerForm.value.email,
    password: registerForm.value.password,

  }

  axiosInst.post('/register/', formData)
    .then(response => {
      toast.success("Registration successful! Please sign in.", { timeout: 2000 });
      isRegistering.value = false;
      // Optionally clear form
      registerForm.value = { username: '', first_name: '', last_name: '', email: '', password: '' };
      is_registering.value = false;
    })
    .catch(error => {
      toast.error("Registration failed. Try again.", { timeout: 3000 });
      is_registering.value = false;
    });
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



