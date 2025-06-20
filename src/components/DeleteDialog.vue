<!-- dynamic delete dialog -->

<template>
  <v-list-item @click.stop="openDeleteDialog">
    <v-icon class="mr-3" size="x-small">
      mdi-delete
    </v-icon>

    {{ props.deleteText }}
  </v-list-item>

  <v-row justify="center">
    <v-dialog v-model="delete_dialog" content-class="align-dialog" transition="dialog-top-transition">
      <v-card>
        <v-card-title class="text-center">
          <span class="text-h5">
            <span>
              <v-icon class="text-error" icon="mdi-information"></v-icon>
              Confirm <span class="text-error">Critical</span> Action.
            </span>
          </span>
          <v-btn class="float-right" icon size="small" dark @click="delete_dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="text-center">
          <v-alert type="error" icon="mdi-alert-circle-outline" variant="tonal" class="mb-7">
            {{ props.confirmation_message }}
          </v-alert>

          <p class="text-disabled mb-5">
            <v-chip color="error">
              <small>
                <span class="font-weight-bold">{{ props.popupname }}:</span> {{ state.item[props.confirmation_field] }}
              </small>
            </v-chip>
          </p>

          <p  class="text-subtitle-2 my-5 text-grey" v-if="props.employee_lead_count_url != ''">
            {{ state.employee_lead_count_message }}
          </p>

          <p class="text-caption my-2 text-grey" v-if="props.itemsToReplace != null">Some Records/Accounts in the System may be tied to
            the {{ props.popupname }} you want to {{ props.deleteText }}. You MUST specify one {{ props.popupname }} to inherit these records</p>

            <!-- {{ finalItemsToReplace }} -->

          <v-autocomplete v-if="props.itemsToReplace != null" v-model="itemtoSwap" clearable
            :label="`${props.popupname} to swap with`" :items="finalItemsToReplace" :item-value="iValue" :item-title="iTitle"
            variant="outlined" @update:model-value="checkDeleteStatus" :menu-props="{ maxHeight: 300 }"></v-autocomplete>
          <p>Please type <v-chip color="error">{{ props.deleteText }}</v-chip> to confirm.</p>

          <v-row class="mt-3">
            <v-col md="10" offset="1">
              <v-text-field @input="checkDeleteStatus" v-model="state.confirm_delete" variant="solo"
                label="Confirm"></v-text-field>
            </v-col>
          </v-row>


        </v-card-text>
        <v-card-actions class="justify-space-between px-6">
          <v-btn color="success" variant="tonal" @click="delete_dialog = false">
            Discard
          </v-btn>
          <v-btn @click="deleteAction" :disabled="state.deleteConfirmButtonStatus" :loading="state.is_submiting"
            color="error" variant="tonal" type="submit">
            {{ props.deleteText }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue';
import LoadingSpinnerVue from '@/components/LoadingSpinner.vue';
import { globalStore } from '@/stores/globalStore'
import { Form, Field, ErrorMessage } from 'vee-validate';
import BreadCrumb from '@/components/BreadCrumb.vue';
import { useRoute, useRouter } from 'vue-router'
import DataTable from '@/components/DataTable.vue';
import axiosInst from '@/services/api'
import { AuthStore } from '@/stores/authStore'


const auth_store = AuthStore();
const toast = useToast();
const route = useRoute()
const router = useRouter();
const g_Store = globalStore()
const emit = defineEmits(['deleteItem', 'deactivateItem', 'dialogOpened'])

const props = defineProps({
  popupname: String,
  item: Object,
  confirmation_field: String,
  confirmation_message: String,
  is_icon: {
    type: String,
    default: "false"
  },
  itemsToReplace: Array,
  itemValue: String,
  itemTitle: String,
  deleteText: {
    type: String,
    default: 'Delete'
  },
  employee_lead_count_url: {
    type: String,
    default: ''
  },
  abilityToSetToNull: {
    type: Boolean,
    default: true
  },
  must_swap: {
    type: Boolean,
    default: false
  },
});

console.log(props.itemsToReplace);

const iValue = computed(()=>{
  if(props.itemValue == null){
    return 'id'
  }else{
    console.log('0000');
    return props.itemValue
  }
})

const iTitle = computed(()=>{
  if(props.itemTitle == null){
    return 'name'
  }else{
    return props.itemTitle
  }
})





let finalItemsToReplace = null

if (props.itemsToReplace == null || typeof props.itemsToReplace == 'undefined') {
  finalItemsToReplace = computed(() => {
    return []
  })
} else {
  finalItemsToReplace = computed(() => {
    let x = props.itemsToReplace.filter(x => x.id != props.item.id)
    if(props.itemValue == null ){
      if(props.abilityToSetToNull == true){
        // x.push({
        //   id: 'undefined',
        //   name: 'Set As Null'
        // })
        return x
      }else{
        return x
      }
    }else{
      // const obj = {}
      // obj[props.itemValue] =  'undefined'
      // obj[props.itemTitle] = 'Set As Null'
      // x.push(obj)
      return x
    }
  })

}








console.log(finalItemsToReplace.value);
let delete_dialog = ref(false)
let deactivate_dialog = ref(false)
let itemtoSwap = ref(null)
let state = ref({
  is_submiting: false,
  confirm_delete: null,
  item: null,
  deleteConfirmButtonStatus: true,
  employee_lead_count_message: '',
})



function checkDeleteStatus() {
  //if(state.value.confirm_delete == state.value.item[props.confirmation_field])
  if(typeof props.itemsToReplace == 'undefined'){
    if (state.value.confirm_delete == props.deleteText) {
      state.value.deleteConfirmButtonStatus = false
    } else {
      state.value.deleteConfirmButtonStatus = true
    }
  }else{

    if(props.must_swap == true){
      
    }


    if (state.value.confirm_delete == props.deleteText && (itemtoSwap.value != null || props.must_swap == true)) {

      state.value.deleteConfirmButtonStatus = false
    } else {
      state.value.deleteConfirmButtonStatus = true
    }
  }
}


function openDeleteDialog() {
  delete_dialog.value = true
  emit('dialogOpened', props.item)
}

async function deleteAction() {
  let callBackdata = props.item
  callBackdata.itemToSwap = itemtoSwap.value;

  state.value.is_submiting = true
  emit('deleteItem', {
    data: callBackdata, callback: () => {
      state.value.is_submiting = false
      delete_dialog.value = false
    }
  })
}

onMounted(() => {
  state.value.item = props.item

  if(props.employee_lead_count_url != ''){
    console.log(props.item);
    const formData = {
      module: "leads",
    }
    axiosInst.post(props.employee_lead_count_url + props.item.id, formData).then((response)=>{
      console.log(response);
      state.value.employee_lead_count_message = response.data.message
    })
  }
}),


  watch(delete_dialog, (newDialog, oldDialog) => {
    if (newDialog == false) {
      setTimeout(function () {
        state.value.confirm_delete = null;
      }, 500);
    }
  })

</script>
<style scoped></style>
