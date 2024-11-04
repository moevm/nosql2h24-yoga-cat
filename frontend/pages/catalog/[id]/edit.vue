<script setup lang="ts">
import { useExerciseEditStore } from '~/stores/editExercise'
import { storeToRefs } from 'pinia'
import { onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useNotifyStore } from '~/stores/notify'
import FormWrapper from '~/entities/FormWrapper.vue';
import DragAndDrop from '~/shared/ui/DragAndDrop.vue';
import BasicInput from '~/shared/ui/BasicInput.vue';
import BasicTextarea from '~/shared/ui/BasicTextarea.vue';
import InputList from '~/entities/InputList.vue';
import CheckboxesField from '~/entities/CheckboxesField.vue';
import BasicButton from '~/shared/ui/BasicButton.vue';

const exerciseStore = useExerciseEditStore()
const notifyStore = useNotifyStore()
const router = useRouter()
const route = useRoute()

const { isLoading, img, title, description, technique, contraindications, benefit, properties } = storeToRefs(exerciseStore)

const loadExercise = async () => {
  const exerciseId = route.params.id as string
  console.log('Загрузка данных для упражнения с ID:', exerciseId)
  await exerciseStore.loadExerciseData(exerciseId)
  console.log('Данные упражнения загружены:', {
    img: img.value,
    title: title.value,
    description: description.value,
    technique: technique.value,
    contraindications: contraindications.value,
    benefit: benefit.value,
    properties: properties.value
  })
}

const updateExercise = async () => {
  isLoading.value = true
  try {
    await exerciseStore.updateExercise(route.params.id as string)
    notifyStore.addNotification({
      message: 'Асана успешно обновлена',
      type: 'success',
      id: Date.now()
    })
    await router.push('/catalog')
  } catch (error) {
    notifyStore.addNotification({
      message: 'Ошибка при обновлении асаны',
      type: 'error',
      id: Date.now()
    })
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await loadExercise()
})
</script>

<template>
  <div class="wrapper">
    <h1 class="title">Редактировать асану</h1>
    <FormWrapper class="form">
      <DragAndDrop v-model="img" ref="dragAndDrop" :required="false" />
      <BasicInput ref="titleInput" type="text" v-model="title" placeholder="Название" :required="true" />
      <BasicInput ref="descriptionInput" type="text" v-model="description" placeholder="Описание" :required="true" />
      <BasicTextarea ref="techniqueTextarea" v-model="technique" placeholder="Техника выполнения" :required="true" />
      <InputList ref="contraindicationsInputList" v-model="contraindications" title="Противопоказания" :required="true" />
      <InputList ref="benefitInputList" v-model="benefit" title="Польза" :required="true" />
      <CheckboxesField :properties="properties" theme="purple" />
      <BasicButton label="Сохранить изменения" theme="purple" class="add-button" @click="updateExercise" />
    </FormWrapper>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  & .title {
    margin-bottom: 2rem;
  }

  & .form {
    align-items: center;
    width: 40rem;
    display: flex;
    flex-direction: column;
    row-gap: 1rem;

    .add-button {
      padding: 0.7rem;
      margin-top: 3rem;
      width: 20rem;
      margin-bottom: 2rem;
    }
  }
}
</style>
