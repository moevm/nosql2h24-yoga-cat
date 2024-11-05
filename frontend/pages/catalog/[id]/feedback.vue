<script setup lang="ts">
import {ref, reactive, onMounted} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import CustomSelect from '~/shared/ui/CustomSelect.vue';
import BasicInput from '~/shared/ui/BasicInput.vue';
import BasicButton from '~/shared/ui/BasicButton.vue';
import StarIcon from '~/shared/icons/StarIcon.vue';
import type { Exercise } from '~/types/exercise';
import { useNotifyStore } from '~/stores/notify';
import ErrorIcon from '~/shared/icons/ErrorIcon.vue';
const selectOptions = ref<{id: string, value: string}[]>([]);
const isLoading = ref(false)
const isStarsValid = ref(true)
const notifyStore = useNotifyStore()
const router = useRouter()
const route = useRoute()
const id = route.params.id
const data = reactive({
  name: '',
  age: '',
  asanaTitle: '',
  sensations: '',
  stars: 0,
})

const nameInput = ref()
const ageInput = ref()
const feelsInput = ref()
const asanaTitle = ref()
const handleStarClick = (count: number) => {
  isStarsValid.value = true;
  data.stars = count
}
const sendReview = async () => {
  isLoading.value = true
  try{
    const nameIsValid = nameInput.value?.validate()
    const ageIsValid= ageInput.value?.validate()
    const feelsIsValid = feelsInput.value?.validate()
    const asanaTitleIsValid = asanaTitle.value?.validate()
    isStarsValid.value = (data.stars !== 0);
    if (nameIsValid && ageIsValid && feelsIsValid && asanaTitleIsValid && isStarsValid.value){
      const selectedAsana = selectOptions.value.find((opt)=> opt.value===data.asanaTitle)
      if(selectedAsana){
        await fetch(`http://localhost:8080/exercises/${selectedAsana.id}/review`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: data.name,
            age: data.age,
            rating: data.stars,
            comment: data.sensations,
          }),
        });
        await router.push(`/catalog/${selectedAsana.id}`)
        notifyStore.addNotification({
          message: 'Отзыв успешно добавлен',
          type: 'success',
          id: Date.now()
        })
      }
    }
  }
  catch{
    notifyStore.addNotification({
      message: 'Произошла ошибка во время создания отзыва',
      type: 'error',
      id: Date.now()
    })
    await router.push('/')
  }
  finally {
    isLoading.value = false;
  }
}
onMounted(async ()=> {
  try {
    const url = `http://localhost:8080/exercises`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error status: ${response.status}`);
    }
    const responseData = await response.json()
    const selectedAsana = responseData.exercises.find((ex: Exercise)=> ex._id===id)
    if(selectedAsana){
      data.asanaTitle = selectedAsana.title;
    }
    console.log('selectedAsana', selectedAsana);
    selectOptions.value = responseData.exercises.map((el: Exercise)=> ({id: el._id, value: el.title}))
  } catch (error) {
    console.error('Error:', error);
  }
})
</script>

<template>
  <div class="review">
    <img src="public/assets/images/reviewBackground.png" alt="background" class="background"/>
    <h1 class="review__title">
      Оставить отзыв
    </h1>
    <div class="review__content">
      <BasicInput ref="nameInput" type="text" v-model="data.name" placeholder="Имя" class="review__content__input" :required="true" :rules="[(val:string | number) => `${val}`.length>0 || 'Поле должно быть не пустым']"/>
      <BasicInput ref="ageInput"  type="text" v-model="data.age" placeholder="Возраст" class="review__content__input" :required="true" :rules="[(val:string | number) => `${val}`.length>0 || 'Поле должно быть не пустым', (val: string | number)=> !isNaN(parseInt(`${val}`)) || 'Введите число']"/>
      <CustomSelect ref="asanaTitle" v-model="data.asanaTitle" :options="selectOptions" placeholder="Название асаны" :required="true" :rules="[(val:string) => `${val}`.length>0 || 'Выберите асану из предложенных']"/>
      <BasicInput ref="feelsInput" type="text" v-model="data.sensations" placeholder="Опишите свои ощущения от асаны" class="review__content__input" :required="true" :rules="[(val:string | number) => `${val}`.length>0 || 'Поле должно быть не пустым']"/>
      <div class="stars-container">
        <div class="review__content__stars" :class="{error: !isStarsValid}">
          <div class="review__content__stars__title" :class="{error: !isStarsValid}">
            Сколько звезд ставите асане?
          </div>
          <div class="review__content__stars__stars">
          <span v-for="item in 5" :key="item" :class="{active: item<=data.stars}" class="star" @click="handleStarClick(item)">
            <StarIcon width="30" height="30"/>
          </span>
          </div>
        </div>
        <transition name="error">
          <div v-if="!isStarsValid" class="error-message">
            <ErrorIcon class="error-icon" />
            <span class="error text-xs text-red-500">
            Необходимо поставить оценку
          </span>
          </div>
        </transition>
      </div>
      <BasicButton label="Отправить" class="review__content__send" @click="sendReview"/>
    </div>
  </div>

</template>

<style scoped lang="scss">
.background{
  max-width: 1600px;
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
}
.stars-container{
  max-width: 600px;
  width: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 0.2rem;
  .error-message{
    color: $red;
  }
}
.review{
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
  gap: 80px;
  &__title{
    font-weight: 400;
    font-size: 6rem;
    z-index: 2;
    position: relative;
    color: $light-brand
  }
  &__content{
    width: 100%;
    row-gap: 20px;
    display: flex;
    z-index: 2;
    flex-direction: column;
    align-items: center;
    padding: 50px;
    background-color: $brand;
    border-radius: 90px;
    &__input{
      max-width: 600px;
    }
    &__stars{
      width: 100%;
      border-radius: 5rem;
      background-color: $light-brand;
      display: flex;
      flex-direction: column;
      row-gap: 0.5rem;
      align-items: center;
      padding: 0.5rem;
      border: 2px solid transparent;
      &.error{
        border: 2px solid $red;
      }
      &__stars{
        display: flex;
        gap: 0.3rem;
        .star{
          cursor: pointer;
          color: #C3C3C3;
          transition: color 0.3s ease;
          &.active{
            color: #FFA931;
          }
        }
      }
      &__title{
        color: $brand;
        font-size: 1rem;
        font-weight: 400;
        &.error{
          color: $red;
          &::after{
            color: $red;
          }
        }
        &::after{
          content: '*';
          color: $brand;
        }
      }
    }
    &__send{
      background-color: transparent !important;
      color: $light-brand !important;
      border-color: $light-brand !important;
      width: 400px;
      &:hover{
        background-color: #89738f !important;
      }
    }
  }
}
.error-enter-active,
.error-leave-active {
  transition: opacity 0.5s ease;
}

.error-enter-from,
.error-leave-to {
  opacity: 0;
}
</style>
