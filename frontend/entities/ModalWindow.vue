<script setup lang="ts">
import { onClickOutside } from '@vueuse/core';
import {ref, onMounted, onUnmounted, watch} from 'vue'
type Props = {
  title: string,
  subtitle: string,
  closedClickOutside: boolean,
  isVisible: boolean,
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  subtitle: '',
  closedClickOutside: false,
  isVisible: false,
})
const target = ref(null)
const emits = defineEmits(['close'])
onClickOutside(target, (event) => {
  if(props.closedClickOutside){
    emits('close')
  }
});
const addModalClass = () => {
  document.body.classList.add('body-modal-open');
};

const removeModalClass = () => {
  document.body.classList.remove('body-modal-open');
};
onMounted(() => {
  if (props.isVisible) {
    addModalClass();
  }
});
onUnmounted(() => {
  removeModalClass();
});
watch(()=> props.isVisible, (newValue) => {
  if (newValue) {
    addModalClass();
  } else {
    removeModalClass();
  }
});
</script>

<template>
  <div class="modal-backdrop" v-if="isVisible">
    <div class="modal" ref="target">
      <div class="title">{{title}}</div>
      <div class="subtitle">{{subtitle}}</div>
      <slot name="buttons"/>
    </div>
  </div>

</template>

<style scoped lang="scss">
.modal-backdrop {
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal{
  margin: 0 100px;
  background-color: $light-brand;
  padding: 3rem;
  max-width: 800px;
  width: 100%;
  border-radius: 5rem;
  .title{
    font-weight: 400;
    font-size: 3rem;
    color: $brand;
    text-align: center;
    margin-bottom: 1.5rem;
  }
  .subtitle{
    text-align: center;
    margin-bottom: 2.5rem;
    font-size: 2rem;
    color: $brand;
  }
}

</style>
