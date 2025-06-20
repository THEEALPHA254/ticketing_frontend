<template>

 
</template>

<script setup>
import { ref } from 'vue'
import Submenu from './Submenu.vue';


  const drawer = ref(null)
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