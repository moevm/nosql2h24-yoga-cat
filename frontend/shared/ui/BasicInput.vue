<script setup lang="ts">
import { useAttrs, ref, watch } from 'vue';
import ErrorIcon from "~/shared/icons/ErrorIcon.vue";
import type {Rule} from "~/types/types";

type PropsType<T>= {
  theme?: string;
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
  rules?: Rule<T>[];
};

const props = withDefaults(defineProps<PropsType<string | number>>(), {
  theme: 'basic',
  disabled: false,
  required: false,
  placeholder: '',
});
const model = defineModel<string | number>()
const inputFocused = ref(false)

const attrs = useAttrs();
const errorMessage = ref('')

function validate() {
  errorMessage.value = '';
  if (props.rules && model.value!==undefined) {
    for (const rule of props.rules) {
      const result = rule(model.value);
      if (result !== true) {
        errorMessage.value = result as string;
        break;
      }
    }
  }
  return errorMessage.value.length === 0;
}
defineExpose({
  validate,
});
</script>

<template>
  <div class="wrap">
    <div class="input-wrap" :class="{'error' : errorMessage.length>0,  [theme]: true,}">
      <label :class="['floating-label', { 'active': model || inputFocused, 'required':props.required }]">{{ placeholder }}</label>
      <input
        v-bind="attrs"
        autocomplete="off"
        :required="required"
        v-model="model"
        :disabled="disabled"
        @focus="inputFocused = true"
        @input="errorMessage = ''"
        @blur="()=> inputFocused = false"
      />
      <span class="after" >
      <slot name="after"/>
    </span>
    </div>
    <transition name="fade">
      <div v-if="errorMessage" class="error-message">
        <ErrorIcon class="error-icon" />
        <span class="error text-xs text-red-500">
      {{ errorMessage }}
    </span>
      </div>
    </transition>
  </div>

</template>

<style scoped lang="scss">
.wrap{
  max-width: 1200px;
  width: 100%;
}
.input-wrap {
  border-radius: 80px;
  position: relative;
  width: 100%;
  &.error {
    input {
      border-color: $red;
      background-color: $light-red;
    }
    .floating-label,
    .after {
      color: $red;
    }
    .floating-label.required::after {
      content: '*';
      color: $red;
    }
  }
  &.light{
    .after{
      color: $light-brand;
    }
    .floating-label{
      color: $light-brand;
      &.required::after {
        color: $light-brand;
      }
    }
    input {
      background-color: $brand;
      color: $light-brand;
      border: 2px solid $light-brand;
    }
  }
  .after {
    cursor: pointer;
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    display: inline-flex;
    color: $brand;
    transition: all 0.2s ease;

    &:hover {
      color: #9b80a1;
    }
  }
  .floating-label {
    pointer-events: none;
    padding-left: 15px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    transition: all 0.2s ease;
    font-size: 1rem;
    color: $brand;

    &.active {
      top: 14px;
      font-size: 12px;
    }
    &.required::after {
      content: '*';
      color: $brand;
    }
  }
}

input {
  background-color: $light-brand;
  padding: 20px 15px 10px !important;
  font-family: 'Century Gothic', sans-serif;
  font-weight: 300;
  line-height: 1.2;
  outline: none;
  font-size: 18px;
  width: 100%;
  height: 100%;
  color: $brand;
  border-radius: 80px;
  border: 2px solid $brand;
  cursor: text;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

