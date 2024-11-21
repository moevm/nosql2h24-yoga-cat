<script setup lang="ts">
defineProps({
  width: {
    type: String,
    default: '24',
  },
  height: {
    type: String,
    default: '24',
  },
});
</script>

<template>
  <svg :width="width" :height="height" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>

</template>

<style scoped lang="scss">

</style>
