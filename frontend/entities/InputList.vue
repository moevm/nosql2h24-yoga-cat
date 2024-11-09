<script setup lang="ts">
import {ref, watch} from 'vue'
import {toRef} from 'vue'
import ErrorIcon from "~/shared/icons/ErrorIcon.vue";
type Rule = (value: (string|undefined)[]) => true | string
type Props = {
  title: string,
  required: boolean,
  initialCount?: number,
  rules?: Rule[],
}
const props = withDefaults(defineProps<Props>(), {
  required: false,
  title: undefined,
  initialCount: 3,
  rules: undefined,
});
const count = ref(props.initialCount)
const model = defineModel<string[]>({ default: [] })
const addInput = () => {
  count.value++
}
const errorMessage = ref<string>('');
const validate = () => {
  errorMessage.value = '';
  let isValid = true;
  if (props.rules) {
    for (const rule of props.rules) {
      const result = rule(model.value);
      if (result !== true) {
        errorMessage.value = result;
        isValid = false;
        break;
      }
    }
  }
  return isValid;
};
defineExpose({
  validate
})
watch(() => props.initialCount, (newVal) => {
  count.value = newVal;
}, { immediate: true });
</script>

<template>
  <div class="wrapper" :class="{ error: errorMessage.length}">
    <span :class="{required: required}" class="title">{{title}}</span>
    <div class="wrapper__inputs">
      <div v-for="idx in count" :key="idx" class="input-wrap">
        <span class="input-wrap__counter">{{idx}}.</span>
        <input type="text" v-model="model[idx-1]" class="input-wrap__input" @input="errorMessage=''">
      </div>
    </div>
    <div class="wrapper__info">
      <span class="plus" @click="addInput">+</span>
      <transition name="fade">
        <div class="error-block" v-if="errorMessage">
          <ErrorIcon/>
          <div class="error-message">{{ errorMessage }}</div>
        </div>
        </transition>
    </div>
  </div>
</template>

<style scoped lang="scss">
.input-wrap {
  width: 100%;
  border: 2px solid $brand;
  border-radius: 5rem;
  padding: 0.3rem 0.75rem;
  display: flex;
  align-items: center;
  &__counter {
    color: $purple;
    margin-right: 0.4rem;
    &.error {
      color: $red;
    }
  }
  &__input {
    width: 100%;
    font-family: 'Century Gothic', sans-serif;
    background-color: transparent;
    outline: none;
    border: none;
    color: $brand;
    &.error {
      color: $red;
      border-color: $red;
    }
  }
  &.error {
    border-color: $red;
  }
}

.wrapper {
  &.error {
    .title {
      color: $red;
      &.required::after {
        content: '*';
        color: $red;
      }
    }
    .input-wrap{
      background-color: $light-red;
      border-color: $red;
    }
  }

  &__inputs {
    width: 100%;
    row-gap: 0.625rem;
    flex-direction: column;
    display: flex;
  }
  &__info {
    gap: 0.5rem;
    align-items: center;
    display: flex;
    align-self: flex-start;
  }
  .title {
    align-self: flex-start;
    margin-bottom: 0.5rem;
    color: $brand;
    &.required::after {
      content: '*';
      color: $brand;
    }
    &.error {
      color: $red;
      &.required::after {
        content: '*';
        color: $red;
      }
    }
  }
  .plus {
    align-self: flex-start;
    cursor: pointer;
    padding: 0.4px;
    color: $brand;
    font-size: 2rem;
    transition: all 0.2s ease;
    &:hover {
      color: #79647e;
    }
  }
}

.error-block {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: $red;
  .error-message {
    color: $red;
    font-size: 0.9rem;
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
