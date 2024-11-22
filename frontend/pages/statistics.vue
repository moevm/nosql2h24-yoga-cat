<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { useStatisticsStore } from '~/stores/showStatistics';
import {storeToRefs} from "pinia";
import BasicButton from "#shared/ui/BasicButton.vue";
import CustomSelect from '~/shared/ui/CustomSelect.vue';
import {ref, onMounted, reactive, onBeforeMount} from 'vue'
import type {Exercise} from "~/types/exercise";
import ErrorIcon from "#shared/icons/ErrorIcon.vue";
import CustomDatepicker from "~/shared/ui/CustomDatepicker.vue";
const statisticsStore = useStatisticsStore();
const {type, date, exercise_id} = storeToRefs(statisticsStore);
const selectOptions = ref<{id: string, value: string}[]>([]);
const data = reactive({
  asanaTitle: '',
});

const asanaTitle = ref();
const justMounted = ref(true);

const applyFilters = () => {
  let asanaTitleIsValid = true;
  if(type.value == 'DYNAMIC'){
    asanaTitleIsValid = asanaTitle.value?.validate()
  }
  const selectedAsana = selectOptions.value.find((opt)=> opt.value===data.asanaTitle);
  if(selectedAsana){
    exercise_id.value = selectedAsana.id;
  }
  if(date.value.length == 2 && asanaTitleIsValid && type.value != 'BASIC'){
    statisticsStore.getStatistics();
  }
  justMounted.value = false;
}

const changeType = () => {
  asanaTitle.value?.resetError();
}

onMounted(async ()=> {
  try {
    const url = `http://localhost:8080/exercisesAll`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error status: ${response.status}`);
    }
    const responseData = await response.json()
    selectOptions.value = responseData.map((el: Exercise)=> ({id: el._id, value: el.title}))
  } catch (error) {
    console.error('Error:', error);
  }
})

onBeforeMount(()=> {
  statisticsStore.$reset()
})
</script>

<template>
  <div class="wrapper">
    <h1>Статистика</h1>
    <div class="date-block">
      <span class="block_title">Выберите временной промежуток для построения статистики</span>
      <CustomDatepicker :model-value="date" :range="true" :max-date="new Date()" class="date" label="Промежуток дат" @update:model-value="(newValue) => date = newValue"/>
      <transition name="error">
        <div v-if="justMounted==false && date.length != 2" class="error-message">
          <ErrorIcon class="error-icon" />
          <span class="error text-xs text-red-500">
            {{ 'Необходимо выбрать промежуток дат' }}
          </span>
        </div>
      </transition>
    </div>

    <div class="type-block">
      <div class="header_block">
        <span class="block_title">Для каких параметров построить статистику:</span>
        <transition name="error">
          <div v-if="justMounted==false && type=='BASIC'" class="error-message">
            <ErrorIcon class="error-icon" />
            <span class="error text-xs text-red-500">
            {{ 'Выберите нужный тип статистики' }}
          </span>
          </div>
        </transition>
      </div>
      <div class="radio_block">
        <input type="radio" id="dynamic" value="DYNAMIC" v-model="type"/>
        <label for="dynamic" class="label">Динамика оценок на асану за выбранный период</label>
        <CustomSelect ref="asanaTitle" class="asana_selector" v-model="data.asanaTitle" :required="type=='DYNAMIC'" :options="selectOptions" placeholder="Название асаны" :rules="[(val:string) => `${val}`.length>0 || 'Выберите асану из предложенных']"/>
      </div>
      <div class="radio_block">
        <input type="radio" id="stars" value="STARS" v-model="type" @click="changeType"/>
        <label for="stars" class="label">Количество асан с оценками 5,4,3,2,1 звёзд</label>
      </div>
      <div class="radio_block">
        <input type="radio" id="asanas_count" value="ASANAS_COUNT" v-model="type"/>
        <label for="asanas_count" class="label">Количество асан, загруженных в каждый день выбранного периода</label>
      </div>
      <div class="radio_block">
        <input type="radio" id="reviews_count" value="REVIEWS_COUNT" v-model="type"/>
        <label for="reviews_count" class="label">Количество отзывов, написанных в каждый день выбранного периода</label>
      </div>
      <div class="radio_block">
        <input type="radio" id="percent" value="PERCENT" v-model="type"/>
        <label for="percent" class="label">Диаграмма с процентным соотношением асан каждого типа по критериям: позвоночник, положение в пространстве, акценты нагрузки, периферия</label>
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
    padding: 1rem 9rem 1rem 9rem;
    .date{
      max-width: 75%;
    }
  }
  & .type-block{
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 1rem 9rem 1rem 9rem;
    .header_block{
      width: 100%;
      display: flex;
      flex-direction: row;
    }
    & .radio_block{
      align-items: center;
      display: flex;
      margin: 0.5rem;
      input{
        min-width: 2rem;
        min-height: 2rem;
        accent-color: $brand;
      }
      & .label{
        font-size: 1.2rem;
        color: $brand;
        margin-left: 1rem;
        max-width: 80%;
      }
      & .asana_selector {
        max-width: 20%;
        margin-left: 1rem;
      }
    }
  }
  .block_title {
    color: $brand;
    padding: 0.8rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 100%;
    display: inline-block;
    font-weight: 400;
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }
}
.error-message {
  margin-top: 0.2rem;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  color: $red;
  padding-left: 0.5rem;
  .error-icon {
    flex-shrink: 0;
    margin-right: 0.2rem;
  }
}
.error-enter-active,
.error-leave-active {
  transition: opacity 0.5s ease;
}

.error-enter-from,
.error-leave-to {
  opacity: 0;
}
</style>