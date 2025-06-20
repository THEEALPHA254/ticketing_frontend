
<template lang="">
    <div class="d-flex my-5">
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-text-field class=""
      v-model="state.search"
      variant="underlined"
      append-inner-icon="mdi-magnify"
      placeholder="Search..."
      single-line hide-details
      ></v-text-field>
    </div>
    <v-table>

    <thead>
      <tr>
        <th class="text-left" v-for="field in headers" :key='field.value' @click="sortTable(field)">
          <div class="d-flex">
            {{field.text}}
            <div class="d-flex flex-column ml-3" v-if="field.value != state.sortColumn && field.value != 'actions'">
              <v-icon size="x-small" class="mb-0">mdi-chevron-up</v-icon>
              <v-icon size="x-small">mdi-chevron-down</v-icon>
            </div>
            <v-icon class="mt-1" v-if="field.value == state.sortColumn" :icon="state.ascending ? 'mdi-chevron-down' : 'mdi-chevron-up'" size="small"></v-icon>
          </div>
        </th>
      </tr>
    </thead>

    <tbody>
        <tr v-if="get_rows.length > 0" v-for="row in get_rows" :key='row' @dblclick="onRowDblClick(row)"   @click="onRowClick(row)" :style="clickopens ? 'cursor: pointer;' : 'cursor: text' " >
          <td class="text-left" v-for="field in headers" :key='field.value'>
            <slot :name="field.value" :childField = "row[field.value]" :row = "row">
              {{row[field.value]}}
            </slot>
          </td>
        </tr>
        <tr v-else>
          <td colspan="10">
            <v-alert class="text-center my-6" density="compact" type="info" variant="tonal">
              <div class="text-h7">No data found. Try again later:</div>
            </v-alert>
          </td>
        </tr>


    </tbody>

  </v-table>

  <v-col>
    <v-pagination
        show-first-last-page
        size="small"
        v-model="state.currentPage"
        :length="num_pages()"
      ></v-pagination>
  </v-col>



</template>
<script setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

let state = ref({
  currentPage: 1,
  elementsPerPage: 10,
  ascending: false,
  sortColumn: '',
  search: '',
})

let searchClosed = ref(true)
const emit = defineEmits(['rowClick'])


const props = defineProps({
  Data: {
    type: Array,
  },
  headers: {
    type: Array,
  },
  clickopens: {
    type: String,
  },
  dbClickopens: {
    type: String,
  },
  is_leads: {
    type: String,
    default: 'false'
  },
})


function sortTable(col) {

  if (state.value.sortColumn === col.value) {
    state.value.ascending = !state.value.ascending;
  } else {
    state.value.ascending = true;
    state.value.sortColumn = col.value;
  }

  var ascending = state.value.ascending;

  props.Data.sort(function (a, b) {
    if (a[col.value] > b[col.value]) {
      return ascending ? 1 : -1
    } else if (a[col.value] < b[col.value]) {
      return ascending ? -1 : 1
    }
    return 0;
  })
}

function num_pages() {
  return Math.ceil(props.Data.length / state.value.elementsPerPage);
}


const get_rows = computed(() => {
  var start = (state.value.currentPage - 1) * state.value.elementsPerPage;
  var end = start + state.value.elementsPerPage;

  let result = props.Data.filter((obj) => {
    return Object.keys(obj).some((key) => {
      if (obj[key] !== null) {
        const tempKey = obj[key].toString().toLowerCase();
        const tempSearch = state.value.search.toLowerCase();
        return tempKey.includes(tempSearch);
      }
    });
  });
  return result.slice(start, end);
})


function change_page(page) {
  state.value.currentPage = page;
}

function onRowClick(row){
  if(props.clickopens == ''|| props.clickopens == null || typeof props.clickopens === 'undefined')
  {
    return false
  }
  else if(props.clickopens == 'rowClick'){
    emit('rowClick', row)
  }
  else{
    // redirect to the page.


    if (props.is_leads == 'true') {
      router.push({
        name: "leads-details",
        params: {
          uuid: row.uuid,
          id: row.id,

        },
      });
    } else {
      router.push({
        name: props.clickopens,
        params: {
          id: row.id,
        },
      })

    }
  }
}

function onRowDblClick(row){

  if(props.is_leads == 'true'){
    router.push({
    name: "leads-details",
    params: {
      uuid: row.uuid,
      id: row.id,

    },
  });
  }else{
    router.push({
        name: props.dbClickopens,
        params: {
          id: row.id,
        },
    })

  }

}



</script>


<style scoped>


</style>
