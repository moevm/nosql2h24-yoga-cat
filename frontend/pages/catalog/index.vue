<script setup lang="ts">
import { type Ref, ref } from 'vue';
import BasicInput from "~/shared/ui/BasicInput.vue";
import SearchIcon from "~/shared/icons/SearchIcon.vue";
import BasicButton from '~/shared/ui/BasicButton.vue';
import CheckboxesField from '~/entities/CheckboxesField.vue';
import type { Properties } from '~/types/exercise';
import { use } from 'h3';
const searchAsana = ref('')
const properties: Ref<Properties> =  ref({
  spine: [{
    key: 'DEFLECTION',
    value: false,
    title: 'Прогиб'
  }, {
    key: 'INCLINE',
    value: false,
    title: 'Наклон'
  }, {
    key: 'TWIST',
    value: false,
    title: 'Скрутка'
  }, {
    key: 'LATERAL_TILT',
    value: false,
    title: 'Боковой наклон'
  }],
    positionInSpace: [
    {
      key: 'STANDING_ON_HANDS',
      value: false,
      title: 'Стоя на руках'
    }, {
      key: ' STANDING_ON_FEET',
      value: false,
      title: 'Стоя на ногах'
    }, {
      key: 'SITTING',
      value: false,
      title: 'Сидя'
    }, {
      key: 'LYING_ON_STOMACH',
      value: false,
      title: 'Лежа на животе'
    }, {
      key: 'LYING_ON_BACK',
      value: false,
      title: 'Лежа на спине'
    }, {
      key: 'LYING_ON_YOUR_SIDE',
      value: false,
      title: 'Лежа на боку'
    }, {
      key: 'TURNED_OVER',
      value: false,
      title: 'Перевернутые'
    }
  ],
    loadAccent: [
    {key: 'STRENGTH', value: false, title: 'Силовая'},
    {key: 'FLEXIBILITY', value: false, title: 'Гибкостная'},
    {key: 'BALANCE', value: false, title: 'Балансовая'}],
    periphery: [
    {key: 'OPENING_HIP_JOINTS', value: false, title: 'Раскрытие тазобедренных суставов'},
    {key: 'OPENING_SHOULDER_JOINTS', value: false, title: 'Раскрытие плечевых суставов'}],
  stars: [{
    key: 5,
    value: false,
  }, {
    key: 4,
    value: false,
  }, {
    key: 3,
    value: false,
  }, {
    key: 2,
    value: false,
  }, {
    key: 1,
    value: false,
  }]
})
</script>

<template>
  <div class="wrapper">
    <h1 class="title">Каталог упражнений</h1>
    <div class="search-block">
      <BasicInput type="text" v-model="searchAsana" placeholder="Название асаны">
        <template #after> <SearchIcon width="22" height="22"/></template>
      </BasicInput>
    </div>
    <div class="filter">
      <div class="filter__header">
        <h3 class="header__title">Фильтры</h3>
        <div class="header__buttons">
          <BasicButton label="Искать по отзывам"/>
          <span class="header__buttons__hide">Скрыть</span>
        </div>
      </div>
      <div class="filter__body">
        <CheckboxesField :properties="properties" theme="light"/>
      </div>
      <div class="filter__footer">
        <BasicButton label="Применить фильтры"/>
        <BasicButton label="Сбросить фильтры"/>
      </div>
    </div>
    <div class="result">
      <div class="result__header">
        <h3 class="header__title">Асаны по вашему запросу</h3>
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
