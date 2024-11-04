<script setup lang="ts">
import { useAttrs, ref, watch } from 'vue';
import ErrorIcon from "~/shared/icons/ErrorIcon.vue";
import type { Rule } from "~/types/types";

type PropsType<T> = {
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  maxRows?: number;
  rules?: Rule<T>[];
};

const props = withDefaults(defineProps<PropsType<string | number>>(), {
  disabled: false,
  required: false,
  placeholder: '',
  rows: 3,
  maxRows: 6,
});

const model = defineModel<string | number>();
const inputFocused = ref(false);
const attrs = useAttrs();
const errorMessage = ref('');

function validate() {
  errorMessage.value = '';
  if (props.rules && model.value !== undefined) {
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

function handleInput() {
  errorMessage.value = '';
}
defineExpose({
  validate,
});

</script>

<template>
  <div class="wrap">
    <div class="textarea-wrap" :class="{'error' : errorMessage.length > 0}">
      <label :class="['floating-label', { 'active': model || inputFocused, 'required': props.required }]">{{ placeholder }}</label>
      <textarea
          v-bind="attrs"
          autocomplete="off"
          :required="required"
          v-model="model"
          :disabled="disabled"
          :rows="rows"
          @focus="inputFocused = true"
          @input="handleInput"
          @blur="() => { inputFocused = false}"
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

<style lang="scss">
.wrap{
  width: 100%;
  max-width: 1200px;
}
.textarea-wrap {
  border-radius: 30px;
  position: relative;
  width: 100%;

  &.error {
    textarea {
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
    top: 14px;
    transform: translateY(0);
    transition: all 0.2s ease;
    font-size: 1rem;
    color: $brand;

    &.active {
      top: 0.4rem;
      font-size: 12px;
    }
    &.required::after {
      content: '*';
      color: $brand;
    }
  }
}

textarea {
  min-height: 8rem;
  background-color: $light-brand;
  padding: 20px 15px 10px !important;
  font-family: 'Century Gothic', sans-serif;
  font-weight: 300;
  line-height: 1.2;
  outline: none;
  font-size: 18px;
  width: 100%;
  height: auto;
  color: $brand;
  border-radius: 30px;
  border: 2px solid $brand;
  cursor: text;
  resize: vertical;
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
