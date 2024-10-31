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
  <svg :width="width" :height="height" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.25 29.25H33.75V31.5H2.25V29.25ZM28.575 10.125C29.475 9.225 29.475 7.875 28.575 6.975L24.525 2.925C23.625 2.025 22.275 2.025 21.375 2.925L4.5 19.8V27H11.7L28.575 10.125ZM22.95 4.5L27 8.55L23.625 11.925L19.575 7.875L22.95 4.5ZM6.75 24.75V20.7L18 9.45L22.05 13.5L10.8 24.75H6.75Z" fill="currentColor"/>
  </svg>

</template>

<style scoped lang="scss">

</style>
