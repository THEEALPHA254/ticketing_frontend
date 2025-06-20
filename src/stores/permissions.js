import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {isUserLoggedIn} from "@/auth/utils";
import { useRouter, useRoute } from "vue-router";
import { Toaster, toast } from 'vue-sonner'
import  LeadsHelper  from "@/core/composables/roles";


export const PermissionStore = defineStore("PermissionStore", () => {
  const router = useRouter();
  const state = ref({
    action_tree: null,
    tree_is_loading: true,
  });


  return {
    state,
  }

  /* ====================================== */
  // middleware functions.

});
