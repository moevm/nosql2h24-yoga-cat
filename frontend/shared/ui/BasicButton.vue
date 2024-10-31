<script setup lang="ts">

type Props = {
  theme?: string
  loading?: boolean
  disabled?: boolean
  label?: string
  leftIcon?: string
  rightIcon?: string
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'basic',
  loading: false,
  disabled: false,
  label: undefined,
  leftIcon: undefined,
  rightIcon: undefined
})

</script>

<template>
  <button :class="theme" :disabled="loading || disabled" type="button" class="button-wrap">
    <slot name="before">
    </slot>
    <slot>
      <template v-if="label">
        {{ label }}
      </template>
    </slot>
    <slot name="after">
    </slot>
  </button>
</template>
<style lang="scss" scoped>
.button-wrap{
  border: none;
  outline: none;
  font-family: 'Century Gothic', sans-serif;
  border-radius: 80px;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  padding: 1rem 1.5rem;
  &:hover{
    cursor: pointer;
  }
}
.basic{
  border: 2px solid $brand;
  background-color: $light-brand;
  color: $brand;
  &:hover{
    background-color: $purple;
  }
}
.purple{
  background-color: $brand;
  color: $light-brand;
  &:hover{
    background-color: #74607a;
  }
}
</style>
