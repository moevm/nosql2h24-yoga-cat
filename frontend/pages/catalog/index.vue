<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import BasicInput from "~/shared/ui/BasicInput.vue";
import BasicButton from '~/shared/ui/BasicButton.vue';
import CheckboxesField from '~/entities/CheckboxesField.vue';
import { useFiltersStore } from '~/stores/catalog';
import ExerciseCard from '~/entities/ExerciseCard.vue';
const filterStore = useFiltersStore()
const {properties, isLoading, exercises} = storeToRefs(filterStore)
const isShowFilters = ref(false)

const resetFilters  = async () => {
  try{
    isLoading.value = true;
    filterStore.resetFilters()
    await filterStore.applyFilters()
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
    isLoading.value = true
    await filterStore.applyFilters()
    console.log('exersixes', exercises.value);
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
        <BasicButton label="Применить фильтры" @click="filterStore.applyFilters()"/>
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
    <div class="result">
      <div class="result__header">
        <h3 class="result__title">Асаны по вашему запросу</h3>
        <NuxtLink to="/create">
          <BasicButton label="Добавить асану"/>
        </NuxtLink>
      </div>
      <div class="result__body" :class="{loading: isLoading}">
        <ExerciseCard v-for="(item) in exercises" :key="item.title" :id="item._id" :img="item.img" :name="item.title" :description="item.description" :stars="5"/>
      </div>
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
.result{
  display: flex;
  flex-direction: column;
  row-gap: 2rem;
  &.loading{

  }
  &__body{
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

}
.no-filters{
  margin-bottom: 0.3rem;
}
</style>
