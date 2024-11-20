<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker'
import type { DatePickerInstance } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import BasicButton from '~/shared/ui/BasicButton.vue';
const datepicker = ref<DatePickerInstance>(null)
interface Props {
  modelValue: Date[] | null
  label?: string
  autoPosition?: boolean
  minDate?: Date | null
  maxDate?: Date | null
}

const props = withDefaults(defineProps<Props>(), {
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
        :hide-input-icon="true"
        :enable-time-picker="false"
        :clearable="false"
        range
        :min-date="minDate ? minDate : undefined"
        :max-date="maxDate ? maxDate : undefined"
    >
      <template #action-row="{ internalModelValue, selectDate }">
        <div class="action-row flex w-full items-center justify-between">
          <p class="current-selection">{{ formatDate(internalModelValue) }}</p>
          <BasicButton class="select-button" @click="selectDate">Р’С‹Р±СЂР°С‚СЊ</BasicButton>
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
      <Icon name="ekit-x" class="cross" :size="14" />
    </div>
    <div
        v-if="!localModelValue"
        class="calendar-wrap icon-wrap"
        @click="openCalendar"
    >
      <Icon name="ekit-blank-calendar" :size="16" class="calendar" />
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.dp__theme_light) {
  --dp-primary-color: #0077ff !important;
}

:deep(.dp__outer_menu_wrap) {
  left: 0 !important;
}

.data-picker-wrap {
  position: relative;
  &:not(.invalid) {
    &:deep .dp__input_focus {
      box-shadow: 0 0 0 2px $brand;
    }
  }
  &.open {
    & .label {
      top: 1.3rem;
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
    left: 12px;
    font-size: 14px;
    font-family: Inter, sans-serif;
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
  background-color: red !important;
  height: 4rem;
  border-radius: 16px !important;
  color: black !important;
  font-size: 14px;
  font-weight: 500;
  padding-top: 1.75rem !important;
  padding-bottom: 0.75rem !important;
  transition: all 0.2s ease;
}
.invalid {
  &:deep(.dp__input) {
    box-shadow: 0 0 0 2px red !important;
    background: orange !important;
  }
}
.icon-wrap {
  color: $light_red;
  transition: all 0.2s ease;
  &:hover {
    cursor: pointer;
    color: $light_brand;
  }
}
.select-button {
  height: fit-content !important;
  padding: 5px !important;
  font-weight: 400 !important;
}
</style>