<script setup lang="ts">
import { computed, ref } from 'vue';
import EditIcon from '~/shared/icons/EditIcon.vue';
import CameraIcon from '~/shared/icons/CameraIcon.vue';
import { useNotifyStore } from '~/stores/notify';
import ErrorIcon from '~/shared/icons/ErrorIcon.vue';

const props = defineProps({
  modelValue: { type: [File, null, String], default: null },
  fileTypes: { type: Array, default: () => ['.jpg', '.jpeg', '.png'] },
  maxSize: { type: Number, default: 5 },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
});

const emits = defineEmits(['update:modelValue', 'notValid']);
const fileInput = ref<HTMLInputElement | undefined>();
const acceptedFileTypes = props.fileTypes.join(',');
const notifyStore = useNotifyStore();
const isHovered = ref(false);
const errorMessage = ref('');
const handleDragEnter = (): void => {
  isHovered.value = true;
};

const handleDragLeave = (): void => {
  isHovered.value = false;
};

const openExplorer = (): void => {
  fileInput.value?.click();
};

const processFile = (files: FileList): void => {
  console.log('filres', files);
  if (files.length > 1) {
    notifyStore.addNotification({
      message: 'Разрешен только один файл',
      type: 'error',
      id: Date.now()
    });
    clearFileInput();
    return;
  }

  const file = files[0];
  if (!file.type.startsWith('image/')) {
    notifyStore.addNotification({
      message: `Только изображения форматов ${acceptedFileTypes} могут быть добавлены`,
      type: 'error',
      id: Date.now()
    });
    clearFileInput();
    return;
  }
  if (file.size / 1024 / 1024 > props.maxSize) {
    notifyStore.addNotification({
      message: `Слишком большой размер файла. Максимум ${props.maxSize} MB.`,
      type: 'error',
      id: Date.now()
    });
    clearFileInput();
    return;
  }
  errorMessage.value = ''
  emits('update:modelValue', file);
};

const fileUrl = computed(() => {
  if (props.modelValue && props.modelValue instanceof File) {
    return URL.createObjectURL(props.modelValue);
  }
  if(props.modelValue){
    return props.modelValue;
  }
  return undefined;
});

const handleFileUpload = (event: Event): void => {
  const files = (event.target as HTMLInputElement).files;
  if (files) {
    processFile(files);
  }
};

const handleDrop = (event: DragEvent): void => {
  event.preventDefault();
  isHovered.value = false;
  if (event.dataTransfer && event.dataTransfer.files.length > 0) {
    processFile(event.dataTransfer.files);
  }
};

const validate = () => {
  if (!props.modelValue && props.required) {
    errorMessage.value = 'Необходимо выбрать изображение';
  } else {
    errorMessage.value = '';
  }
  return errorMessage.value.length===0
};

const editFile = (): void => {
  fileInput.value?.click();
};
const clearFileInput = () => {
  if(fileInput.value){
    fileInput.value.value = null;
  }
};
const handleClickWrap = (): void => {
  if (!props.modelValue) {
    openExplorer();
  }
};
defineExpose({
  validate,
});
</script>
<template>
  <div class="wrap" :class="{error: errorMessage.length}">
    <div
        class="drag-drop-wrap"
        :class="{ active: modelValue, hovered: isHovered }"
        @click="handleClickWrap"
        @dragover.prevent
        @dragenter="handleDragEnter"
        @dragleave="handleDragLeave"
        @drop="handleDrop"
    >
      <input
          ref="fileInput"
          name="file"
          type="file"
          class="drag-drop-wrap-input"
          :accept="acceptedFileTypes"
          @input="handleFileUpload"
      />

      <div v-if="modelValue" class="uploaded-image">
        <img :src="fileUrl" alt="Uploaded Image" />
        <div class="edit-icon" @click.prevent.stop="editFile">
          <EditIcon width="25" height="25" />
        </div>
      </div>

      <template v-else>
        <div class="drag-drop-wrap__icon">
          <CameraIcon width="40" height="40"/>
        </div>
        <span class="drag-drop-wrap__text" :class="{required: required}">Добавить фото</span>
        <span class="drag-drop-wrap__text--mini">Перетащите или нажмите</span>
      </template>
    </div>
    <div v-if="errorMessage.length" class="wrap-error">
      <ErrorIcon/>
      <span>{{ errorMessage }}</span>
    </div>
  </div>

</template>
<style scoped lang="scss">
.wrap{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  row-gap: 0.5rem;
  .wrap-error{
    align-items: center;
    display: flex;
    gap: 0.5rem;
    color: $red;
  }
  &.error{
    .drag-drop-wrap{
      background-color: $light-red;
      border-color: $red;
      &:hover{
        background-color: #f3dfdf;
      }
      &__icon, &__text{
        color: $red;
      }
      &__text.required::after{
        color: $red;
      }
    }
  }
}
.edit-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $brand;
  border-radius: 15px;
  width: 2.5rem;
  height: 2.5rem;
  position: absolute;
  padding: 4px;
  top: 5px;
  right: 5px;
  cursor: pointer;
  transform: translate(50%, -50%);
  color: $light-brand;
  transition: all 0.2s ease;
  &:hover{
    background-color: #78637e;
  }
}
.uploaded-image {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 12rem;
  height: 100%;
  border-radius: 2rem;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    max-width: 100%;
    border-radius: 2rem;
  }
}
.drag-drop-wrap {
  max-height: 12rem;
  max-width: 12rem;
  width: 12rem;
  height: 12rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  row-gap: 0.3rem;
  border-radius: 2rem;
  border: 2px dashed $brand;
  position: relative;
  background-color: transparent;
  min-width: fit-content;
  cursor: pointer;
  transition: all 0.2s ease;
  &.active{
    cursor: auto;
    border: 2px solid $brand;
  }
  &__icon, &__text{
    pointer-events: none;
    transition: color 0.2s ease;
    color: $brand;
  }
  &__text.required::after{
    content: '*';
    color: $brand;
  }
  &__text--mini{
    pointer-events: none;
    color: $brand;
    font-size: 12px;
  }
  &:hover:not(.active), &.hovered {
    background-color: $purple;
  }
  &.error {
    background-color: $light-brand;
  }
  &-input {
    display: none;
  }
  &-error {
    font-size: 0.75rem;
    line-height: 140%;
    font-weight: 600;
    color: $red;
    width: 100%;
    height: 1rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
}
</style>
