<script setup lang="ts">
import { ref, watch, defineProps } from 'vue';
import Shevron from '~/shared/icons/Shevron.vue';
import type {SelectOption} from '~/types/ui.ts';
const target = ref(null)
import { onClickOutside } from '@vueuse/core'
import ErrorIcon from '~/shared/icons/ErrorIcon.vue';
export type Rule = (value: string) => boolean | string;
onClickOutside(target, (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false;
  }
});
const dropdownRef = ref(null);
const errorMessage = ref('')
const props = defineProps({
  options: {
    type: Array as () => SelectOption[],
    required: true,
  },
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: null,
  },
  required: {
    type: Boolean,
    default: false,
  },
  rules: {
    type: Array as () => Rule[],
    default: () => [],
  },
});

const emit = defineEmits(['update:modelValue']);

const isDropdownOpen = ref(false);
const selectedOption = ref(props.modelValue);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const selectOption = (option : SelectOption) => {
  errorMessage.value = ''
  selectedOption.value = option.value;
  emit('update:modelValue', option.value);
};
watch(() => props.modelValue, (newValue) => {
  selectedOption.value = newValue;
}, {immediate: true});

function validate() {
  errorMessage.value = '';
  if (props.rules) {
    for (const rule of props.rules) {
      const result = rule(props.modelValue);
      if (result !== true) {
        errorMessage.value = result as string;
        break;
      }
    }
  }
  return errorMessage.value.length === 0;
}

function resetError() {
  errorMessage.value = '';
}
defineExpose({
  validate,
  resetError,
});
</script>


<template>
    <div class="custom-select" ref="target">
      <div class="selected"  @click="toggleDropdown" :class="{error: errorMessage.length}">
        <span class="selected__elem" v-if="selectedOption">{{ selectedOption }}</span>
        <span class="selected__placeholder" :class="{active: selectedOption, required: required, error: errorMessage.length}" >{{placeholder}}</span>
        <span class="selected__icon" :class="{active: isDropdownOpen}">
           <Shevron width="18" height="18"/>
        </span>
      </div>
      <transition name="error">
        <div v-if="errorMessage" class="error-message">
          <ErrorIcon class="error-icon" />
          <span class="error text-xs text-red-500">
            {{ errorMessage }}
          </span>
        </div>
      </transition>
      <Transition name="fade">
        <div class="dropdown" v-show="isDropdownOpen" ref="dropdownRef">
          <div
            class="option"
            v-for="option in options"
            :key="option.value"
            @click="selectOption(option)"
          >
            {{ option.value }}
          </div>
        </div>
      </Transition>
    </div>
  </template>


<style scoped lang="scss">
.custom-select {
  position: relative;
  cursor: pointer;
  max-width: 600px;
  width: 100%;
  .selected {
    width: 100%;
    border-radius: 5rem;
    z-index: 400;
    border: 1px solid #ccc;
    background-color: $light-brand;
    &.error{
      border: 2px solid $red;
    }
    min-height: 50px;
    position: relative;
    display: flex;
    align-items: center;
    padding: 20px 15px 10px !important;
    justify-content: space-between;
    &__elem{
      color: $brand;
    }
    &__placeholder{
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 15px;
      transition: all 0.3s ease;
      color: $brand;
      &.error{
        color: $red;
        &.required::after{
          color: $red;
        }
      }
      &.required::after{
        content: '*';
        color: $brand;
      }
      &.active{
        font-size: 10px;
        top: 15px;
      }
    }
    &__icon{
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
      margin-left: auto;
      color: $brand;
      display: flex;
      align-items: center;
      transition: all 0.2s ease;
      &:hover{
        color: #503f55;
      }
      &.active {
        transform: translateY(-50%) rotate(180deg);
      }
    }
  }
}

.dropdown {
  overflow: hidden;
  border-radius: 20px;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  border: 1px solid #ccc;
  background-color: $light-brand;
  z-index: 5;
}

.option {
  transition: background-color 0.3s ease;
  padding: 10px 15px;
  cursor: pointer;
  color: $brand;
}

.option:hover {
  background-color: #e4dee6;
}
.fade-enter-active, .fade-leave-active {
  position: absolute;
  transition: opacity 0.3s ease, transform 0.15s linear;

}

.fade-enter-from, .fade-leave-to{
  opacity: 0;
  transform: translateY(-50px);
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

