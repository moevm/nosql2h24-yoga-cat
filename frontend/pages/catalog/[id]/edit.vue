<script setup lang="ts">
import { useExerciseEditStore } from '~/stores/editExercise'
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import { useNotifyStore } from '~/stores/notify'
import FormWrapper from '~/entities/FormWrapper.vue';
import DragAndDrop from '~/shared/ui/DragAndDrop.vue';
import BasicInput from '~/shared/ui/BasicInput.vue';
import BasicTextarea from '~/shared/ui/BasicTextarea.vue';
import InputList from '~/entities/InputList.vue';
import CheckboxesField from '~/entities/CheckboxesField.vue';
import BasicButton from '~/shared/ui/BasicButton.vue';
const contraindicationsInputList = ref(null)
const benefitInputList = ref(null)
const dragAndDrop = ref(null)
const titleInput = ref(null)
const descriptionInput = ref(null)
const techniqueTextarea = ref(null)
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
    const contraindicationsIsValid = contraindicationsInputList.value?.validate()
    const benefitsIsValid = benefitInputList.value?.validate()
    const dragAndDropIsValid = dragAndDrop.value?.validate()
    const titleIsValid = titleInput.value?.validate()
    const descriptionIsValid = descriptionInput.value?.validate()
    const techniqueIsValid = techniqueTextarea.value?.validate()
    if (contraindicationsIsValid && benefitsIsValid && dragAndDropIsValid && titleIsValid && descriptionIsValid && techniqueIsValid) {
      await exerciseStore.updateExercise(route.params.id as string)
      notifyStore.addNotification({
        message: 'Асана успешно обновлена',
        type: 'success',
        id: Date.now()
      })
      console.log("Succcccccc");
    }
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
      <BasicInput ref="titleInput" type="text" v-model="title" placeholder="Название" :required="true" :rules="[(val:string | number) => `${val}`.length>0 || 'Поле должно быть не пустым']" />
      <BasicInput ref="descriptionInput" type="text" v-model="description" placeholder="Описание" :required="true" :rules="[(val:string | number) => `${val}`.length>0 || 'Поле должно быть не пустым']" />
      <BasicTextarea ref="techniqueTextarea" v-model="technique" placeholder="Техника выполнения" :required="true" :rules="[(val:string | number) => `${val}`.length>30 || 'Поле должно содержать более 30 символов']" />
      <InputList ref="contraindicationsInputList" :initial-count="contraindications.length" v-model="contraindications" title="Противопоказания" :required="true" :rules="[(val: (string|undefined)[])=> val.some((elem)=> (elem !== undefined && elem.length>0) )|| 'Введите хотя бы одно значение']" />
      <InputList ref="benefitInputList" :initial-count="benefit.length" v-model="benefit" title="Польза" :required="true" :rules="[(val: (string|undefined)[])=> val.some((elem)=> (elem !== undefined && elem.length>0) )|| 'Введите хотя бы одно значение']" />
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
