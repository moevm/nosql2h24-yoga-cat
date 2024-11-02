<script setup lang="ts">
import FormWrapper from "~/entities/FormWrapper.vue";
import DragAndDrop from "~/shared/ui/DragAndDrop.vue";
import BasicInput from "~/shared/ui/BasicInput.vue";
import {useExerciseCreateStore} from "~/stores/createExercise";
import {storeToRefs} from "pinia";
import {onUnmounted, ref} from 'vue'
import {useRouter} from 'vue-router'
import BasicTextarea from "~/shared/ui/BasicTextarea.vue";
import InputList from "~/entities/InputList.vue";
import CheckboxesField from "~/entities/CheckboxesField.vue";
import BasicButton from "~/shared/ui/BasicButton.vue";
import {useNotifyStore} from "~/stores/notify";
const exerciseStore = useExerciseCreateStore()
const notifyStore = useNotifyStore()
const router = useRouter();
const contraindicationsInputList = ref(null)
const benefitInputList = ref(null)
const dragAndDrop = ref(null)
const titleInput = ref(null)
const descriptionInput = ref(null)
const techniqueTextarea = ref(null)
const {isLoading, img, title, description, technique, contraindications, benefit, properties } = storeToRefs(exerciseStore)
const createExercise = async () => {
  isLoading.value = true
  try{
    const contraindicationsIsValid = contraindicationsInputList.value?.validate()
    const benefitsIsValid = benefitInputList.value?.validate()
    const dragAndDropIsValid = dragAndDrop.value?.validate()
    const titleIsValid = titleInput.value?.validate()
    const descriptionIsValid = descriptionInput.value?.validate()
    const techniqueIsValid = techniqueTextarea.value?.validate()
    if (contraindicationsIsValid && benefitsIsValid && dragAndDropIsValid && titleIsValid && descriptionIsValid && techniqueIsValid){
      await exerciseStore.createExercise()
      await router.push('/catalog')
      notifyStore.addNotification({
        message: 'Асана успешно создана',
        type: 'success',
        id: Date.now()
      })
    }

  }
  catch{
    notifyStore.addNotification({
      message: 'Произошла ошибка во время добавления асаны',
      type: 'error',
      id: Date.now()
    })
    await router.push('/')
  }
  finally {
    isLoading.value = false;
  }
}
onUnmounted(()=> {
  exerciseStore.$reset()
})
</script>

<template>
  <div class="wrapper">
    <h1 class="title">Добавить асану</h1>
    <FormWrapper class="form">
      <DragAndDrop v-model="img" ref="dragAndDrop" :required="true"/>
      <BasicInput ref="titleInput" type="text" v-model="title" placeholder="Название" :required="true" :rules="[(val:string | number) => `${val}`.length>0 || 'Поле должно быть не пустым']"/>
      <BasicInput ref="descriptionInput" type="text" v-model="description" placeholder="Описание" :required="true"  :rules="[(val:string | number) => `${val}`.length>0 || 'Поле должно быть не пустым']"/>
      <BasicTextarea ref="techniqueTextarea" v-model="technique" :required="true" placeholder="Техника выполнения"  :rules="[(val:string | number) => `${val}`.length>30 || 'Поле должно содержать более 30 символов']"/>
      <InputList ref="contraindicationsInputList"  v-model="contraindications" title="Противопоказания" :required="true" :rules="[(val: (string|undefined)[])=> val.some((elem)=> (elem !== undefined && elem.length>0) )|| 'Введите хотя бы одно значение']" />
      <InputList ref="benefitInputList" v-model="benefit" title="Польза" :required="true" :rules="[(val: (string|undefined)[])=> val.some((elem)=> (elem !== undefined && elem.length>0) )|| 'Введите хотя бы одно значение']"/>
      <CheckboxesField :properties="properties" theme="purple"/>
      <BasicButton label="Добавить" theme="purple" class="add-button" @click="createExercise"/>
    </FormWrapper>

  </div>

</template>

<style scoped lang="scss">
.wrapper{
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  & .title{
    margin-bottom: 2rem;
  }
  & .form{
    align-items: center;
    width: 40rem;
    display: flex;
    flex-direction: column;
    row-gap: 1rem;
    .add-button{
      padding: 0.7rem;
      margin-top: 3rem;
      width: 20rem;
      margin-bottom: 2rem;
    }
  }
}
</style>
