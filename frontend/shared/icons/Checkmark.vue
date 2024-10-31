<script setup lang="ts">
defineProps({
  width: {
    type: String,
    default: '18',
  },
  height: {
    type: String,
    default: '18',
  },
});
</script>

<template>
  <svg :width="width" :height="height" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.99997 19.414L2.29297 12.707L3.70697 11.293L8.99997 16.586L20.293 5.293L21.707 6.707L8.99997 19.414Z" fill="currentColor"/>
  </svg>

</template>

<style scoped lang="scss">

</style>
