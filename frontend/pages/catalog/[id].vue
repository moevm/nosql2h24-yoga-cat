<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
const asanaId = route.params.id;

</script>

<template>
  <h1>{{asanaId}}</h1>
</template>

<style scoped lang="scss">

</style>
