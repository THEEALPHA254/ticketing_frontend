<template>
  <v-btn v-if="props.btn_type == 'flat'" @click="sanitizeModalCreate" class="ml-auto mr-4"
    :variant="props.variant_" size="small">
    {{ add_new_text }}
  </v-btn>

  <v-btn v-else variant="outlined" @click="sanitizeModalCreate" class="ml-16 mt-5" size="small" icon>
    <v-icon>mdi-plus</v-icon>
  </v-btn>

  <v-dialog v-model="dialog" :content-class="props.modal_width" persistent>
    <v-card>
      <v-card-title>
        <span class="text-h6">
          <v-btn variant="flat" class="float-right" icon size="small" dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <span v-if="!editing_mode" class="text-subtitle-2">
            <v-icon :icon="props.icon"></v-icon>
            Register {{ props.name }}
          </span>

          <span v-else>
            <v-icon icon="mdi-pencil"></v-icon>
            Edit {{ props.name }}
          </span>
        </span>
      </v-card-title>
      <Form @submit="handleSubmit" :initial-values="formValues">
        <v-card-text>
          <v-container>
            <v-row>
              <v-col v-for="each_field in props.fields" :sm="each_field.col_width ? each_field.col_width : props.field_width" :cols="each_field.col_width ? each_field.col_width : props.field_width_small" >
                <slot v-if="each_field.is_slot" 
                :name="each_field.value"
                />

                <Field :name="each_field.value" v-slot="{ value, field, errors }"
                v-else
                :rules="`${each_field.required ? each_field.type == 'number' ? 'numrequired' : 'required' : ''}${each_field.value == 'email' ? '|email' : ''}`">
                  <v-textarea v-if="each_field.type == 'textarea'" v-bind="field" :model-value="value"
                    :label="`${each_field.text} ${each_field.required == true ? '*' : ''}`" :error-messages="errors"
                    auto-grow variant="outlined" row-height="25" shaped></v-textarea>

                  <v-file-input
                    v-else-if="each_field.type == 'image'"
                    variant="outlined"
                    show-size
                    counter
                    :label="`Upload ${each_field.text}`"
                    @change="$emit('imageFieldUpdated', $event, each_field, editing_mode)"
                  ></v-file-input>

                  <div v-else-if="each_field.type == 'select'">
                    <v-autocomplete density="compact" v-bind="field" :menu-props="{ maxHeight: 300 }" clearable :multiple="each_field.multiple" :error-messages="errors"
                    :model-value="value" no-data-text="No Data Found." :label="`${each_field.text} ${each_field.required == true ? '*' : ''}`"
                    :items="each_field.select_list" :closable-chips="each_field.multiple" :chips="each_field.multiple" :item-value="each_field.item_id" :item-title="each_field.item_title" variant="outlined">
                  </v-autocomplete>
                  <!-- {{ each_field.select_list }} -->
                  </div>
                  <v-text-field v-else-if="each_field.type == 'date'" variant="outlined" v-bind="field" :model-value="value"
                    density="compact"
                    :label="`${each_field.text} ${each_field.required == true ? '*' : ''}`" :error-messages="errors"
                    type="date" :max="each_field.type === 'date' ? new Date().toISOString().split('T')[0] : undefined">
                  </v-text-field>

                  <v-file-input v-else-if="each_field.type == 'file'"
                  variant="outlined"
                  show-size
                  counter
                  :label="`${each_field.text} ${each_field.required == true ? '*' : ''}`"
                  ></v-file-input>

                  <div
                  v-else-if="each_field.type == 'color'"
                  >
                    <v-color-picker hide-inputs="" style="width: 100% !important" v-bind="field"
                    :model-value="value"></v-color-picker>
                    <v-sheet class="pa-4">
                      <pre>{{ value }}</pre>
                    </v-sheet>
                    <span class="text-error" v-if="errors.length > 0">
                      {{ errors[0] }} Select a color for the status.
                    </span>
                  </div>

                  <div v-else  class="d-flex">
                    <span v-if="each_field.prepend_cc">
                      <v-autocomplete
                      variant="outlined"
                      style="width: 200px;"
                      class="mr-4"
                      density="compact"
                      :item-props="itemProps"
                      label="Country Code"
                      v-model="country_code"
                      :items="country_codes"
                      item-title="name" item-value="dialCode" dense>
                      <template v-slot:selection="{ item, index }">
                        <v-chip size="small">
                          <span>
                            {{ item.title.length > 15 ? item.title.slice(0, 10) + '...' : item.title }}
                          </span>

                          <span class="ml-3">{{item.value}}</span>
                        </v-chip>
                      </template>
                    </v-autocomplete>
                    </span>

                    <v-text-field variant="outlined" v-bind="field" :model-value="value"
                      density="compact"
                      :hint="each_field.hint"
                      :label="`${each_field.text} ${each_field.required == true ? '*' : ''}`" :error-messages="errors"
                      @update:modelValue="txtUpdated($event, each_field)"
                      :type="each_field.type"
                      :suffix="each_field.suffix || ''"
                      :max="each_field.type === 'date' ? new Date().toISOString().split('T')[0] : undefined"
                      >
                    </v-text-field>
                  </div>
                </Field>
              </v-col>
              <slot />
            </v-row>
          </v-container>
          <small>*Indicates required field</small>
        </v-card-text>
        <v-card-actions class="justify-space-between px-6">
          <v-btn color="" variant="tonal" @click="dialog = false" size="small">
            Close
          </v-btn>
          <v-btn :loading="is_submiting" color="" variant="outlined" size="small" type="submit">
            Save
          </v-btn>
        </v-card-actions>
      </Form>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue';
import { Form, Field } from 'vee-validate';
import { globalStore } from '@/stores/globalStore';
import { useRoute, useRouter } from 'vue-router';
import axiosInst from '@/services/api';
import { countries } from './dependancies/countries.js';

const route = useRoute();
const router = useRouter();
const g_Store = globalStore();
const emit = defineEmits(['submitForm', 'editForm', 'set_create_mode', 'dialogClosed', 'imageFieldUpdated']);

const props = defineProps({
  field_width: {
    type: String,
    default: "12"
  },
  field_width_small: {
    type: String,
    default: "12"
  },
  name: String,
  modal_width: {
    type: String,
    default: "align-dialog"
  },
  icon: String,
  btn_type: {
    type: String,
    default: "flat"
  },
  variant_: {
    type: String,
    default: "elevated"
  },
  select_list: {
    type: Array,
    default: []
  },
  fields: Array,
  is_registerDocument: {
    type: Boolean,
    default: false
  },
  add_new_text: {
    type: String,
    default: "Create New"
  }
});

function itemProps(item) {
  return {
    title: item.name,
    subtitle: item.dialCode,
  };
}

let country_codes = ref(countries);
let country_code = ref('+254');
let dialog = ref(false);
let formValues = ref(null);
let selectedItems = ref([]);
let editing_mode = ref(false);
let is_submiting = ref(false);
let selected_item = ref(null);

function sanitizeModalCreate() {
  if (props.is_registerDocument == true) {
    emit('set_create_mode');
  }
  dialog.value = true;
  editing_mode.value = false;
  formValues.value = null;
  selectedItems.value = [];
}

function txtUpdated(val, each_field) {
  if (each_field.value == 'phone_number' && val.length > 3 && val.startsWith('+')) {
    const input = val.trim();
    let cleanedInput = input.replace(/[\s\-()]/g, '');

    if (cleanedInput.startsWith('+')) {
      cleanedInput = cleanedInput.slice(1);
    }

    let matchedCountry = null;
    let matchedDialCode = '';

    for (const country of country_codes.value) {
      const dialCodeNumeric = country.dialCode.replace('+', '');

      if (cleanedInput.startsWith(dialCodeNumeric)) {
        matchedCountry = country;
        matchedDialCode = dialCodeNumeric;
        break;
      }
    }

    if (matchedCountry) {
      country_code.value = matchedCountry.dialCode;
    }
  }
}

function resetIsSubmiting() {
  is_submiting.value = false;
}

function handleSubmit(values, { resetForm }) {
  values.country_code = country_code.value;

  if (editing_mode.value == true) {
    is_submiting.value = true;
    let id = selected_item.value.id;

    emit('editForm', {
      data: values, id, callback: () => {
        is_submiting.value = false;
        dialog.value = false;
        selectedItems.value = [];
        formValues.value = null;
        country_code.value = '+254';
      }
    });
    return;
  } else {
    is_submiting.value = true;
    emit('submitForm', {
      data: values, callback: () => {
        is_submiting.value = false;
        dialog.value = false;
        selectedItems.value = [];
        formValues.value = null;
        country_code.value = '+254';
      }
    });
  }
}

watch(dialog, (newDialog) => {
  if (newDialog == false) {
    setTimeout(() => editing_mode.value = false, 500);
  }
});

watch(dialog, (newValue) => {
  if (newValue == false) {
    emit('dialogClosed');
  }
});


function editThisItem(data) {
  selected_item.value = data;
  editing_mode.value = true;

  formValues.value = {};
  props.fields.forEach((field) => {
    if (field.type == 'date') {
      formValues.value[field.value] = selected_item.value[field.value].split('T')[0];
      return;
    }

    if (selected_item.value[field.value] != null && typeof selected_item.value[field.value] == 'object') {
      if (Array.isArray(selected_item.value[field.value])) {
        formValues.value[field.value] = selected_item.value[field.value];
        return;
      }

      formValues.value[field.value] = JSON.stringify(selected_item.value[field.value]);
      return;
    }

    if (field.value == 'phone_number') {
      const input = selected_item.value[field.value].trim();
      let cleanedInput = input.replace(/[\s\-()]/g, '');

      if (cleanedInput.startsWith('+')) {
        cleanedInput = cleanedInput.slice(1);
      }

      let matchedCountry = null;
      let matchedDialCode = '';

      for (const country of country_codes.value) {
        const dialCodeNumeric = country.dialCode.replace('+', '');

        if (cleanedInput.startsWith(dialCodeNumeric)) {
          matchedCountry = country;
          matchedDialCode = dialCodeNumeric;
          break;
        }
      }

      if (matchedCountry) {
        country_code.value = matchedCountry;
        formValues.value[field.value] = cleanedInput.slice(matchedDialCode.length);
      } else {
        country_code.value = '254';
        formValues.value[field.value] = cleanedInput;
      }

      return;
    }

    formValues.value[field.value] = selected_item.value[field.value];
  });
  dialog.value = true;
}

defineExpose({
  editThisItem,
  sanitizeModalCreate,
  resetIsSubmiting,
});

function setupDynamicWatchers() {
  props.fields.forEach(field => {
    if (field.dependsOn) {
      watch(() => formValues.value[field.dependsOn], async (newValue) => {
        if (field.loadOptions) {
          field.select_list = await field.loadOptions(newValue);
        }
      });
    }
  });
}


onMounted(() => {
  setupDynamicWatchers();

  props.fields.forEach(async field => {
    if (!field.dependsOn && field.loadOptions) {
      field.select_list = await field.loadOptions();
    }
  });
});
</script>
<style scoped></style>
