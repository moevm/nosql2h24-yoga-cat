<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker'
import {ref, computed} from 'vue'
import type { DatePickerInstance } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import BasicButton from '~/shared/ui/BasicButton.vue';
import CalendarIcon from '#shared/icons/CalendarIcon.vue'
import { format } from 'date-fns'
import CrossIcon from '#shared/icons/CrossIcon.vue'
const datepicker = ref<DatePickerInstance>(null)
interface Props {
  modelValue: Date[] | Date | null
  range?: boolean
  label?: string
  autoPosition?: boolean
  minDate?: Date | null
  maxDate?: Date | null
}

const props = withDefaults(defineProps<Props>(), {
  range: false,
  label: '',
  autoPosition: true,
  minDate: undefined,
  maxDate: undefined,
})

const emit = defineEmits(['update:modelValue'])

const openCalendar = () => {
  if (datepicker.value) {
    datepicker.value.openMenu()
  }
}
const formatDate = (date: Date | Date[] | null) => {
  if (!date) return '';
  if (Array.isArray(date) && date.length === 2) {
    const [startDate, endDate] = date;
    return `${format(startDate, 'dd.MM.yyyy')} - ${format(endDate, 'dd.MM.yyyy')}`;
  } else if (Array.isArray(date) &&  date.length === 1) {
    return format(date, 'dd.MM.yyyy');
  }
  else if(date){
    return format(date, 'dd.MM.yyyy');
  }
  return '';
};

const localModelValue = computed({
  get() {
    return props.modelValue
  },
  set(newValue) {
    emit('update:modelValue', newValue)
  }
})
</script>

<template>
  <div
      class="data-picker-wrap"
      :class="{ open: localModelValue !== null }"
  >
    <VueDatePicker
        ref="datepicker"
        v-model="localModelValue"
        :auto-position="autoPosition"
        locale="ru"
        :range="range"
        :format="formatDate"
        :hide-input-icon="true"
        :enable-time-picker="false"
        :clearable="false"
        :min-date="minDate ? minDate : undefined"
        :max-date="maxDate ? maxDate : undefined"
    >
      <template #action-row="{ internalModelValue, selectDate }">
        <div class="action-row">
          <p class="current-selection">{{ formatDate(internalModelValue) }}</p>
          <BasicButton class="select-button" @click="selectDate">Выбрать</BasicButton>
        </div>
      </template>
    </VueDatePicker>
    <div class="label" @click="openCalendar">
      <slot name="label">
        {{ label }}
      </slot>
    </div>
    <div
      v-if="localModelValue"
      class="cross-wrap icon-wrap"
      @click="localModelValue = null"
    >
      <CrossIcon/>
    </div>
    <div
      v-if="!localModelValue"
      class="calendar-wrap icon-wrap"
      @click="openCalendar"
    >
      <CalendarIcon width="24" height="24"/>
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.dp__theme_light) {
  --dp-primary-color: $brand !important;
}

:deep(.dp__outer_menu_wrap) {
  left: 0 !important;
}

.data-picker-wrap {
  position: relative;
  border-radius: 30px;
  border: 2px solid $brand;
  &.open {
    & .label {
      top: 1.1rem;
      font-size: 12px;
      font-weight: 500;
    }
  }
  & .calendar {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 1rem;
    &:hover {
      cursor: pointer;
    }
  }
  & .label {
    transition: all 0.1s ease;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 16px;
    font-size: 16px;
    color: $brand;
    &:hover {
      cursor: pointer;
    }
  }
  & .cross {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 1rem;
  }
}
:deep(.dp__input) {
  border: 2px solid transparent !important;
  background-color: transparent !important;
  height: 3.5rem;
  color: $brand !important;
  border-radius: 16px !important;
  font-size: 16px;
  font-weight: 400;
  padding-top: 1.5rem !important;
  padding-bottom: 0.5rem !important;
  transition: all 0.2s ease;
}
:deep(.dp__range_start), :deep(.dp__range_end), :deep(.dp__active_date) {
  background-color: $brand ;
  color: white;
}
:deep(.dp__range_between){
  background-color: $purple;
}
.icon-wrap {
  height: fit-content;
  cursor: pointer;
  color: $brand;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 1rem;
  transition: all 0.2s ease;
  &:hover {
    cursor: pointer;
    color: #4f3f53;
  }
}
.select-button {
  width: 100%;
  height: fit-content !important;
  padding: 5px !important;
  font-weight: 400 !important;
}
.action-row{
  width: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}
</style>
