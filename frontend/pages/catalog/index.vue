<script setup lang="ts">
import { type Ref, ref } from 'vue';
import { storeToRefs } from 'pinia';
import BasicInput from "~/shared/ui/BasicInput.vue";
import SearchIcon from "~/shared/icons/SearchIcon.vue";
import BasicButton from '~/shared/ui/BasicButton.vue';
import CheckboxesField from '~/entities/CheckboxesField.vue';
import { useFiltersStore } from '~/stores/catalog';
const searchAsana = ref('')
const filterStore = useFiltersStore()
const {properties} = storeToRefs(filterStore)
const isShowFilters = ref(false)
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
      <BasicInput type="text" v-model="properties.name" placeholder="Название асаны">
      </BasicInput>
      <div class="filter__body">
        <CheckboxesField :properties="properties" theme="light"/>
      </div>
      <div class="filter__footer">
        <BasicButton label="Применить фильтры" @click="filterStore.applyFilters()"/>
        <BasicButton label="Сбросить фильтры" @click="filterStore.resetFilters()"/>
      </div>
    </div >
    <div v-else class="no-filters">
      <div class="no-filters__header">
        <h3 class="no-filters__title">Асаны по вашему запросу</h3>
        <div class="no-filters__buttons">
          <BasicButton label="Искать по отзывам"/>
          <span class="header__buttons__hide" @click="isShowFilters=true">Развернуть</span>
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
    </div>
  </div>

</template>

<style scoped lang="scss">
.wrapper{
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  & .result{
    padding: 4rem 9rem;
    background-color: $brand;
    border-radius: 5rem;
    width: 100%;
    & .result__header{
      display: flex;
      justify-content: space-between;
    }
  }
  & .title{
    margin-bottom: 2rem;
  }
  .filter{
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
      width: 100%;
      margin-bottom: 5rem;
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
</style>
