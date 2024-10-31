<script lang="ts" setup="">
import Checkmark from "~/shared/icons/Checkmark.vue";

const [modelValue] = defineModel<boolean>({ default: false })
const props = defineProps({
  theme: {
    type: String, default: 'purple'
  }
})
</script>

<template>
  <span :class="['check', {active: modelValue}, theme]" role="checkbox" @click="modelValue = !modelValue">
    <slot v-if="modelValue">
      <span class="checkmark">
         <Checkmark/>
      </span>
    </slot>
  </span>
</template>

<style scoped lang="scss">
.check {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2px;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 2.67px;
  border: 1px solid $brand;
  cursor: pointer;
  transition: all 0.2s ease;
  &:not(.active):hover{
    background-color: $purple;
  }
  &.light{
    border-color: $light-brand;
    &:not(.active):hover{
      background-color: #87758c;
    }
    .checkmark{
      color: $brand;
    }
  }
  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
  & .checkmark{
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.active {
  border-color: $brand;
  background-color: $brand;
  color: $light-brand;
  &.light{
    border-color:$light-brand;
    background-color: $light-brand;
    color: $brand;
  }
}
</style>
