<template>
  <div class="img-bg">
    <v-card flat style="width:100%;height: auto;background-color: transparent;"
    
    >
      <v-row style="display:flex;justify-content: center; align-items: center;">
        <v-col cols="12" md="4"  offset="">
          <v-card elevation="0" class="mx-4 px-5 py-10 rounded-lg" rounded>
            <h4 class=" font-w800 mb-4 text-subtitle-2 text-center" style="font-weight: 800;">Reset Password.</h4>
            <p class="text-caption text-center">Enter email associated with your account. We will send you a new password.</p>
            <Form @submit="resetPass">
              <v-row class="mt-4">
                <v-col cols="12">
                  <Field name="email" v-slot="{ field, errors }" rules="required">
                    <v-text-field
                      density="compact"
                      v-model="state.email"
                      v-bind="field"
                      variant="outlined"
                      hide-details
                      :error-messages="errors"
                      placeholder="Your Email"
                      required
                    ></v-text-field>
                  </Field>
                </v-col>
                <v-col cols="12">
                  <v-btn size="small" :loading="is_submiting" type="submit" color="black" variant="flat" block class="mt-4">
                    Reset Password
                  </v-btn>
                  <div class="d-flex justify-center align-center my-4">
                    <v-divider class="mr-4"></v-divider>
                    or
                    <v-divider class="ml-4"></v-divider>
                  </div>
                  
                  <div class="text-caption d-flex justify-center">
                    <span @click="goToLogin" class=" ml-2  text-info cursor-pointer">Back to Sign in page</span>
                  </div>
                </v-col>
              </v-row>
            </Form>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </div>

  <Toaster position="bottom-right" />

</template>

<script setup>
import { ref } from 'vue';
import { Form, Field } from 'vee-validate';
import { useRoute, useRouter } from 'vue-router';
import axiosIns, { baseURL } from '@/services/api';
import { Toaster, toast } from 'vue-sonner'


const route = useRoute();
const router = useRouter();
const state = ref({
  email: "",
});

const is_submiting = ref(false);






async function resetPass() {
  try {
    is_submiting.value = true;
    const response = await axiosIns.post(`${baseURL}/auth-usr/forgot-password`, {
      email: state.value.email,
    });

    if (response.status === 200) {
      toast.success("New password sent to the provided email");
      router.push({ name: 'login' });
    } else if (response.status === 404) {
      toast.error("Email Does not exist");

    } else {
      toast.error("Reset password request failed");
      console.error("Reset password request failed");
    }

    // Rest of your code...

  } catch (error) {
    // Handle network or other errors
    if ( error.response.data.message){
      toast.error(error.response.data.message);
    }else{
      toast.error("Reset password request failed");

    }

    console.error("Reset password request failed:", error.response.data.message);

  } finally {
    is_submiting.value = false;
  }
}


function goToLogin() {
  router.push({
    name: 'login',
  });
}
</script>

<style scoped>
.img-bg {
  /* background-image: url('@/assets/images/login1.png'); */
  /* background-image: url('https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=1600'); */
  /* background-image: url('https://images.pexels.com/photos/39584/censorship-limitations-freedom-of-expression-restricted-39584.jpeg?auto=compress&cs=tinysrgb&w=1600'); */
  /* background-image: url('https://images.pexels.com/photos/5632397/pexels-photo-5632397.jpeg?auto=compress&cs=tinysrgb&w=1600'); */
 /* background-image: url('https://images.pexels.com/photos/6214360/pexels-photo-6214360.jpeg?auto=compress&cs=tinysrgb&w=1600'); */
  background:  url('https://app.essaypro.com/auth-banner-text-bg-light.0563f7d3004ff083.svg');
  /* background-blend-mode: darken; */
  height: 100vh;
  width: 100vw;
  /* background-repeat: no-repeat; */
  background-size: cover;
  background-position: center center;
  display: flex;
  justify-content: center;
  padding-top: 50px;
}


.add-border {
  border: solid 0.3px rgb(212, 208, 208) !important;
}
</style>
