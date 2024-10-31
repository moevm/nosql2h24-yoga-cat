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
    <rect :height="height" :width="width" rx="12" fill="#15884A" />
    <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M17.1381 8.19526C17.3984 8.45561 17.3984 8.87772 17.1381 9.13807L10.9428 15.3333C10.4221 15.854 9.57789 15.854 9.05719 15.3333L6.19526 12.4714C5.93491 12.2111 5.93491 11.7889 6.19526 11.5286C6.45561 11.2682 6.87772 11.2682 7.13807 11.5286L10 14.3905L16.1953 8.19526C16.4556 7.93491 16.8777 7.93491 17.1381 8.19526Z"
        fill="white"
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
