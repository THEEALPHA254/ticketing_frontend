<template>
    <div
        class="fixed h-1/3 z-50 context-menu"
        :style="{ top: y + 'px', left: x + 'px' }"
    >

      <div

          v-for="action in actions"
          :key="action.action"
          @click="emitAction(action.action)"
      >
        {{ action.label }}
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, defineProps, defineEmits } from 'vue';
  
  const { actions, x, y } = defineProps(['actions', 'x', 'y']);
  const emit = defineEmits(['action-clicked']);
  
  const emitAction = (action) => {
    emit('action-clicked', action);
  };
  </script>
  
  <style scoped>
  .context-menu {
    position: absolute;
    background: white;
    border: 1px solid #ccc;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / .1), 0 2px 4px -2px rgb(0 0 0 / .1);
    min-width: 180px;
    z-index: 200;
    border-radius: 7px;
    padding: 5px;
  }
  
  .context-menu div {
    padding: 8px;
    padding-left: 25px;
    font-size: 14px;
    cursor: pointer;
    border-radius: 7px;
  }
  
  .context-menu div:hover {
    background-color: #f0f0f0;
  }
  </style>