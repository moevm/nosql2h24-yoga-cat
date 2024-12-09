<script setup lang="ts">
import '@vuepic/vue-datepicker/dist/main.css'
import { useStatisticsStore } from '~/stores/showStatistics';
import {storeToRefs} from "pinia";
import BasicButton from "~/shared/ui/BasicButton.vue";
import CustomSelect from '~/shared/ui/CustomSelect.vue';
import {ref, onMounted, reactive, onBeforeMount} from 'vue'
import type {Exercise} from "~/types/exercise";
import ErrorIcon from "#shared/icons/ErrorIcon.vue";
import CustomDatepicker from "~/shared/ui/CustomDatepicker.vue";
import { Chart as ChartJS, Tooltip, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { Bar } from 'vue-chartjs'

const statisticsStore = useStatisticsStore();
const {type, date, exercise_id, data, labels, cur_type, loadAccent, periphery, positionInSpace, spine, counter} = storeToRefs(statisticsStore);
const selectOptions = ref<{id: string, value: string}[]>([]);
const form_data = reactive({
  asanaTitle: '',
});

const asanaTitle = ref();
const justMounted = ref(true);
const dateError = ref(false);
const startDate = ref('');

const statistic_prop = {
  'DYNAMIC': {xTitle: 'Дата', yTitle: 'Оценка', label: 'Средняя оценка по отзывам'},
  'STARS': {xTitle: 'Оценка', yTitle: 'Количество', label: 'Количество асан'},
  'ASANAS_COUNT': {xTitle: 'Дата', yTitle: 'Количество', label: 'Количество добавленных асан', count_label: 'Общее число асан за заданный период'},
  'REVIEWS_COUNT': {xTitle: 'Дата', yTitle: 'Количество', label: 'Количество написанных отзывов', count_label: 'Общее число отзывов за заданный период'},
};

const types_prop = {
  'STRENGTH': 'Силовая', 'FLEXIBILITY': 'Гибкостная', 'BALANCE': 'Балансовая', 'NOTHING': 'Ничего',
  'OPENING_HIP_JOINTS': 'Раскр. тазоб. суставов', 'OPENING_SHOULDER_JOINTS': 'Раскр. плеч. суставов',
  'STANDING_ON_HANDS': 'Стоя на руках', 'STANDING_ON_FEET': 'Стоя на ногах', 'SITTING': 'Сидя', 'LYING_ON_STOMACH': 'Лежа на животе',
  'LYING_ON_BACK': 'Лежа на спине', 'LYING_ON_YOUR_SIDE': 'Лежа на боку', 'TURNED_OVER': 'Перевернутые', 'DEFLECTION': 'Прогиб',
  'INCLINE': 'Наклон', 'TWIST': 'Скрутка', 'LATERAL_TILT': 'Боковой наклон'
};
const chart_data = (label: string, labels: string[], dataset: any[]) => {
  return {
    labels: labels,
    datasets: [
      {
        backgroundColor: ['#66546B'],
        data: dataset,
        label: label
      }
    ]
  }
}

const options = (x: string, y: string) => {
  return {responsive: true,
    scales: {
      x: {
        ticks: {
          font: {
            size: 18,
            family: "'Century Gothic', sans-serif"
          }
        },
        display: true,
        title: {
          display: true,
          text: x,
          padding: {top: 0, left: 0, right: 0, bottom: 0},
          font: {
            size: 25,
            family: "'Century Gothic', sans-serif"
          }
        },
        grid: {
          display: false
        },
        border: {
          color: '#66546B',
        }
      },
      y: {
        ticks: {
          font: {
            size: 18,
            family: "'Century Gothic', sans-serif"
          }
        },
        display: true,
        title: {
          display: true,
          text: y,
          padding: {top: 0, left: 0, right: 0, bottom: 0},
          font: {
            size: 25,
            family: "'Century Gothic', sans-serif"
          }
        },
        grid: {
          display: false
        },
        border: {
          color: '#66546B',
        }
      }
    }
  }
}

ChartJS.register(Tooltip, BarElement, CategoryScale, LinearScale)

const applyFilters = () => {
  if(type.value != 'BASIC'){
    let asanaTitleIsValid = true;
    if(type.value == 'DYNAMIC'){
      asanaTitleIsValid = asanaTitle.value?.validate()
    }
    const selectedAsana = selectOptions.value.find((opt)=> opt.value===form_data.asanaTitle);
    if(selectedAsana){
      exercise_id.value = selectedAsana.id;
    }
    if(((date.value && date.value.every((el)=>el)) || type.value == "STARS" || type.value == "PERCENT") && asanaTitleIsValid){
      statisticsStore.getStatistics();
      dateError.value = false;
    }
    else {
      dateError.value = true;
    }
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
  try {
    const url = `http://localhost:8080/firstdate`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error status: ${response.status}`);
    }
    const responseData = await response.json()
    startDate.value = responseData.firstDate;
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
      <span class="date_notofication">
            {{ 'Возможный промежуток дат ограничен датой создания первого упражнения и сегодняшним днём!' }}
      </span>
      <CustomDatepicker :model-value="date" :range="true" :min-date="new Date(startDate)" :max-date="new Date()" class="date" label="Промежуток дат" @update:model-value="(newValue) => date = newValue"/>
      <transition name="error">
        <div v-if="dateError && (!date || date.some((el)=> !el)) && type!='STARS' && type!='PERCENT' && type!='BASIC'" class="error-message">
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
        <CustomSelect ref="asanaTitle" class="asana_selector" v-model="form_data.asanaTitle" :required="type=='DYNAMIC'" :options="selectOptions" placeholder="Название асаны" :rules="[(val:string) => `${val}`.length>0 || 'Выберите асану из предложенных']"/>
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
        <input type="radio" id="stars" value="STARS" v-model="type" @click="changeType"/>
        <label for="stars" class="label">Количество асан с оценками 5,4,3,2,1 звёзд</label>
      </div>
      <div class="radio_block">
        <input type="radio" id="percent" value="PERCENT" v-model="type"/>
        <label for="percent" class="label">Диаграмма с процентным соотношением асан каждого типа по критериям: позвоночник, положение в пространстве, акценты нагрузки, периферия</label>
      </div>
    </div>
    <BasicButton class="btn" @click="applyFilters">ПОСТРОИТЬ</BasicButton>
    <div v-if="cur_type!='BASIC' && cur_type!='PERCENT'" class="solo_hist_block">
      <div v-if="cur_type=='ASANAS_COUNT' || cur_type=='REVIEWS_COUNT'" class="hist_title">
        {{ statistic_prop[cur_type].count_label }}: {{ counter }}
      </div>
      <Bar style="max-width: 90%; max-height: 30rem" :data="chart_data(statistic_prop[cur_type].label, labels, data)" :options="options(statistic_prop[cur_type].xTitle, statistic_prop[cur_type].yTitle)" />
    </div>
    <div class="stat_block" v-if="cur_type=='PERCENT'">
      <div class="hist_block">
        <div class="hist_title">Акценты нагрузки</div>
        <Bar style="max-width: 100%; max-height: 25rem" :data="chart_data('Процентная доля', loadAccent.map(row => types_prop[row.name]), loadAccent.map(row => row.percent))" :options="options('Тип акцента нагрузки', 'Процентная доля')"  />
      </div>
      <div class="hist_block">
        <div class="hist_title">Периферия</div>
        <Bar style="max-width: 100%; max-height: 25rem" :data="chart_data('Процентная доля', periphery.map(row => types_prop[row.name]), periphery.map(row => row.percent))" :options="options('Тип периферии', 'Процентная доля')"  />
      </div>
      <div class="hist_block">
        <div class="hist_title">Положение в пространстве</div>
        <Bar style="max-width: 100%; max-height: 25rem" :data="chart_data('Процентная доля', positionInSpace.map(row => types_prop[row.name]), positionInSpace.map(row => row.percent))" :options="options('Тип положения в пространстве', 'Процентная доля')"  />
      </div>
      <div class="hist_block">
        <div class="hist_title">Позвоночник</div>
        <Bar style="max-width: 100%; max-height: 25rem" :data="chart_data('Процентная доля', spine.map(row => types_prop[row.name]), spine.map(row => row.percent))" :options="options('Тип положения позвоночника', 'Процентная доля')"  />
      </div>
    </div>
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
  }
  .date_notofication {
    color: $brand;
    padding: 0.8rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 100%;
    display: inline-block;
    font-weight: 400;
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }
  .solo_hist_block {
    width: 100%;
    padding: 1rem 5rem 1rem 5rem;
    display: flex;
    flex-direction: column;
  }
  .stat_block {
    width: 100%;
    padding: 1rem 5rem 1rem 5rem;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    row-gap: 2.5rem;
    column-gap: 1.5rem;
    .hist_block{
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
    }
  }
  .hist_title{
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
