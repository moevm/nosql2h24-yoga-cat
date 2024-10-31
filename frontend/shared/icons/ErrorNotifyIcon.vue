<script lang="ts" setup>
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
  <svg
      :height="height"
      :width="width"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
  >
    <rect :height="height" :width="width" rx="12" fill="#E22446" />
    <path
        d="M7 7L16.6 16.6M16.6 7L7 16.6"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
    />
  </svg>
</template>

<style scoped lang="scss">
svg {
  path {
    transition: 0.25s linear;
  }
}
</style>
