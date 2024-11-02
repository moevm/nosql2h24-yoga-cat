<script setup lang="ts">
import { ref, onMounted, onBeforeMount} from 'vue';
import { storeToRefs } from 'pinia';
import BasicInput from "~/shared/ui/BasicInput.vue";
import BasicButton from '~/shared/ui/BasicButton.vue';
import CheckboxesField from '~/entities/CheckboxesField.vue';
import { useCatalogStore } from '~/stores/catalog';
import ExerciseCard from '~/entities/ExerciseCard.vue';
import Pagination from '~/entities/Pagination.vue';
const catalogStore = useCatalogStore()
const {properties, isLoading, exercises, pagination} = storeToRefs(catalogStore);
const isShowFilters = ref(false)
const resetFilters  = async () => {
  try{
    pagination.value.currentPage = 1;
    isLoading.value = true;
      catalogStore.resetFilters()
      await catalogStore.applyFilters()
  }
  catch(err){
    console.log('error', err);
  }
  finally{
    isLoading.value = false
  }
}
const applyFilters = async() => {
  try{
    isLoading.value = true;
    await catalogStore.applyFilters()
  }
  catch(err){
    console.log('error', err);
  }
  finally{
    isLoading.value = false
  }
}
onMounted(async()=> {
  try{

    isLoading.value = true;
      await catalogStore.applyFilters()
      console.log('exersixes', exercises.value);
  }
  catch(err){
    console.log('err', err);
  }
  finally{
    isLoading.value = false
  }
})
onBeforeMount(()=> {
  catalogStore.$reset()
})
</script>

<template>
  <div class="wrapper">
    <h1 class="title">Каталог упражнений</h1>
    <div v-if="isShowFilters" class="filter">
      <div class="filter__header">
        <h3 class="header__title">Фильтры</h3>
        <div class="header__buttons">
          <BasicButton label="Искать по отзывам"/>
          <span class="header__buttons__hide" @click="isShowFilters=false">Скрыть</span>
        </div>
      </div>
      <div class="filter__body">
        <BasicInput theme="light" type="text" v-model="properties.title" placeholder="Название асаны" class="filter__body__name">
        </BasicInput>
        <CheckboxesField :properties="properties" theme="light"/>
      </div>
      <div class="filter__footer">
        <BasicButton label="Применить фильтры" @click="applyFilters()"/>
        <BasicButton label="Сбросить фильтры" @click="resetFilters"/>
      </div>
    </div >
    <div v-else class="no-filters">
      <div class="no-filters__header">
        <h3 class="no-filters__title">Фильтры</h3>
        <div class="no-filters__buttons">
          <BasicButton label="Искать по отзывам"/>
          <span class="no-filters__buttons__show" @click="isShowFilters=true">Развернуть</span>
        </div>
      </div>
    </div>
    <div class="result" :class="{loading: isLoading}">
      <div v-if="isLoading" class="loader-overlay">
        <div class="loader"></div>
      </div>
      <div class="result__header">
        <h3 class="result__title">Асаны по вашему запросу</h3>
        <NuxtLink to="/create">
          <BasicButton label="Добавить асану"/>
        </NuxtLink>
      </div>
      <div class="result__body">
        <ExerciseCard v-for="(item) in exercises" :key="item.title" :id="item._id" :img="item.img" :name="item.title" :description="item.description" :stars="5"/>
      </div>
      <Pagination
        class="pagination"
        :currentPage="pagination.currentPage"
        :totalPages="pagination.totalPages"
        @update:currentPage="(page) => { pagination.currentPage = page; applyFilters(); }"
      />
    </div>
  </div>

</template>

<style scoped lang="scss">
.wrapper{
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  & .result, .no-filters{
    padding: 2.5rem 9rem;
    background-color: $brand;
    border-radius: 5rem;
    width: 100%;
    & .result__header, & .no-filters__header{
      display: flex;
      justify-content: space-between;
      .no-filters__buttons{
        align-items: center;
        display: flex;
        gap: 1.5rem;
      }
      .no-filters__buttons__show{
        cursor: pointer;
        height: fit-content;
        color: $light-brand;
        font-size: 1.5rem;
        &:hover{
          color: #d5d4d4;
        }
      }
    }
    & .pagination{
      margin-top: auto ;
    }
  }
  & .title{
    margin-bottom: 2rem;
  }
  .filter{
    margin-bottom: 0.3rem;
    width: 100%;
    padding: 2.5rem 9rem;
    background-color: $brand;
    border-radius: 5rem;
    &__header{
      margin-bottom: 2rem;
      align-items: center;
      display: flex;
      justify-content: space-between;
    }
    .header__buttons{
      align-items: center;
      display: flex;
      gap: 1.5rem;
      &__hide{
        cursor: pointer;
        height: fit-content;
        color: $light-brand;
        font-size: 1.5rem;
        &:hover{
          color: #d5d4d4;
        }
      }
    }
    &__body{
      display: flex;
      flex-direction: column;
      row-gap: 1rem;
      width: 100%;
      margin-bottom: 5rem;
      &__name{
        max-width: 100%;
      }
    }
    &__footer{
      display: flex;
      justify-content: space-between;
    }
  }
}
.search-block{
  margin-bottom: 2rem;
  max-width: 1000px;
  width: 100%;
}
.result {
  display: flex;
  flex-direction: column;
  row-gap: 2rem;

  &.loading {
    position: relative;

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

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  }

  &__body {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    row-gap: 2.5rem;
    column-gap: 0.7rem;
  }
}

.no-filters {
  margin-bottom: 0.3rem;
}
</style>
