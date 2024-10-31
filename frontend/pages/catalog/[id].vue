<script setup lang="ts">
import { useRoute } from 'vue-router';
import {onMounted} from 'vue'
const route = useRoute();
const asanaId = route.params.id;
onMounted(async ()=> {
  const url = `http://localhost:8080/exercises/${asanaId}`;
  const response = await fetch(url);
  console.log('res', response);
})
</script>

<template>
  <h1>{{asanaId}}</h1>
</template>

<style scoped lang="scss">

</style>
