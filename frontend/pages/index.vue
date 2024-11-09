<script setup lang="ts">
import BasicButton from "~/shared/ui/BasicButton.vue";
import ExerciseCard from "~/entities/ExerciseCard.vue";
import {storeToRefs} from "pinia";
import { onMounted, ref } from 'vue';
import { useCatalogStore } from '~/stores/catalog';
const catalogStore = useCatalogStore()
const {exercises} = storeToRefs(catalogStore)
const isLoading = ref(false)
onMounted(async()=> {
  try{
    isLoading.value = true;
    await catalogStore.getPopular()
  }
  catch(err){
    console.log('err', err);
  }
  finally{
    isLoading.value = false
  }
})
</script>

<template>
  <div class="wrapper">
    <div class="banner">
      <img src="@/public/assets/images/big-logo.svg" alt="banner__big-logo" class="banner__big-logo">
      <img src="@/public/assets/images/teacher.png" alt="teacher" class="banner__teacher">
    </div>
    <NuxtLink to="/catalog" class="catalog-button">
      <BasicButton label="Каталог упражнений"></BasicButton>
    </NuxtLink>
    <div class="popular">
      <div class="head">
        <h3 class="head__title">Популярное</h3>
        <NuxtLink to="/create">
          <BasicButton label="Добавить асану" class="head__add-button"/>
        </NuxtLink>
      </div>
      <div class="content">
        <ExerciseCard v-for="(item) in exercises"  :key="item.title" :id="item._id" :img="item.img" :name="item.title" :description="item.description" :stars="+item.rating || 0"/>
      </div>
    </div>
    <div v-if="isLoading" class="loader-overlay">
      <div class="loader"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  height: 100dvh;
}
.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid $brand;
  border-radius: 50%;
  width: 100px;
  height: 100px;
  animation: spin 1s linear infinite;
}
.content{
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  row-gap: 2.5rem;
  -moz-column-gap: 0.7rem;
  column-gap: 0.7rem;
}
.wrapper{
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  .banner {
    position: relative;
    display: flex;
    flex-direction: column;
    &__big-logo{
      height: 450px;
    }
    &__teacher{
      width: 400px;
      left:50%;
      transform: translateX(-50%);
      position: absolute;
      bottom: 0;
    }
  }
  .catalog-button{
    margin-bottom: 3rem;
    max-width: 1000px;
    width: 100%;
    :deep(.basic) {
      width: 100%;
      padding: 1.5rem;
    }
  }
  .popular{
    width: 100%;
    padding: 4rem 9rem;
    background-color: $brand;
    border-radius: 90px;
    .head{
      margin-bottom: 2.5rem;
      display: flex;
      justify-content: space-between;
      &__add-button{
        font-size: 1rem;
      }
    }

  }
}

</style>
