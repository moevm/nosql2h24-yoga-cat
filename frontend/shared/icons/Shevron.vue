<script setup lang="ts">
defineProps({
  width: {
    type: String,
    default: '25',
  },
  height: {
    type: String,
    default: '24',
  },
});
</script>

<template>
  <svg :width="width" :height="height" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 7L12.5 16L24 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</template>

<style scoped lang="scss">

</style>
