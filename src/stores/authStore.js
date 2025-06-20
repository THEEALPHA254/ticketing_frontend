import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {isUserLoggedIn} from "@/auth/utils";
// import useJwt from "@/auth/jwt/useJwt";
import { useRouter, useRoute } from "vue-router";
import { Toaster, toast } from 'vue-sonner'


export const AuthStore = defineStore("AuthStore", () => {

  const router = useRouter();
  const loggedIn = ref(false);
  const status = isUserLoggedIn();

  if (status == null){
    loggedIn.value = false;
  }else{
    // user is logged in
    loggedIn.value = true;
  }


  function updateIsLoggedInToTrue(){
      loggedIn.value = true;
  }
  function updateIsLoggedInToFalse(){
      loggedIn.value = false;
  }

  function logout() {

      // Remove userData from localStorage
      // ? we just removed token from localStorage. If you like, you can also make API call to backend to blacklist used token

      // Remove userData from localStorage
      localStorage.removeItem('userData')
      localStorage.removeItem('selectedClient');  //delete selectedClient after logout
      // Redirect to login page
      loggedIn.value = false;
      toast.success(
          "You have successfully logged out.",
          {
            timeout: 2000,
          }
        );
      // router.push({ name: "login" }).then(() => {
      //   toast.success(
      //     "You have successfully logged out.",
      //     {
      //       timeout: 2000,
      //     }
      //   );
      // });
  }



  return {
    loggedIn,
    updateIsLoggedInToTrue,
    updateIsLoggedInToFalse,
    logout,
  };
});
