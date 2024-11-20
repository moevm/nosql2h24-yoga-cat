<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { useStatisticsStore } from '~/stores/showStatistics';
import {storeToRefs} from "pinia";
import BasicButton from "#shared/ui/BasicButton.vue";
const statisticsStore = useStatisticsStore();
const {type, date, exercise_id} = storeToRefs(statisticsStore);

const applyFilters = () => {
  console.log(date);
  console.log(type);
}
</script>



<template>
  <div class="wrapper">
    <h1>Статистика</h1>
    <div class="date-block">
      <VueDatePicker
          v-model="date"
          range
          :enable-time-picker="false"
          :max-date="new Date()"
      />
    </div>
    <div class="type-block">
      <div class="radio_block">
        <input type="radio" id="stars" value="STARS" v-model="type"/>
        <label for="stars" class="label">Количество асан с оценками 5,4,3,2,1 звёзд</label>
      </div>
      <div class="radio_block">
        <input type="radio" id="asanas_count" value="ASANAS_COUNT" v-model="type"/>
        <label for="asanas_count" class="label">Количество асан, загруженных в каждый день выбранного периода</label>
      </div>
    </div>
    <BasicButton class="btn" @click="applyFilters">ПОСТРОИТЬ</BasicButton>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  & .btn{
    background-color: $brand;
    color: $light-brand;
    margin: 1rem;
    width: 24%;
  }
  & .date-block{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: left;
    padding: 1rem 9rem 1rem 9rem;
  }
  & .type-block{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: left;
    padding: 1rem 9rem 1rem 9rem;
    & .radio_block{
      align-items: center;
      display: flex;
      margin: 0.5rem;
      & .label{
        font-size: 1.3rem;
        color: $brand;
        margin-left: 1rem;
      }
    }
  }
}
input{
  //appearance: none;
  //border-radius: 50%;
  //background: $light-brand;
  //border: 0.5rem solid $light-brand;
  width: 2rem;
  height: 2rem;
  //outline: 1px solid $brand;
  accent-color: $brand;
}
</style>