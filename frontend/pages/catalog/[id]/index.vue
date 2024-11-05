<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import {onMounted} from 'vue';
import { storeToRefs } from 'pinia';
import { useExerciseStore } from '~/stores/showExercise';
import BasicButton from '~/shared/ui/BasicButton.vue';
import StarIcon from "~/shared/icons/StarIcon.vue";
import ModalWindow from '~/entities/ModalWindow.vue';
const route = useRoute();
const router = useRouter();
const asanaId = route.params.id;
const isOpenRemoveWindow = ref(false)
const exerciseStore = useExerciseStore();
const {isLoading, exercise} = storeToRefs(exerciseStore);
const data = computed(()=>exercise.value);
const goToReview = async ()=> {
  await router.push(`/catalog/${route.params.id}/feedback`);
}
const removeAsana = () => {
  console.log('remove');
  isOpenRemoveWindow.value = false;
}
onMounted(async ()=> {
  await exerciseStore.getExercise(asanaId);
  console.log(data);
})
</script>

<template>
  <div class="wrapper">
    <div class="header_bar">
      <BasicButton class="button" label="Редактировать асану"/>
      <h1 class="title">{{exercise.title}}</h1>
      <BasicButton class="button" label="Удалить асану" @click="()=> isOpenRemoveWindow = true"/>
    </div>
    <div class="description_block">
      <div class="stars_description">
        <div class="stars"><StarIcon v-for="star in 5" :key="star" width="50" height="50"/></div>
        <div class="description">
          <h3>Описание</h3>
          <br>
          <div class="content">{{exercise.description}}</div>
        </div>
      </div>
      <img :src="exercise.img" :alt="exercise.title">
    </div>
    <div class="technique">
      <h3>Техника выполнения</h3>
      <br>
      <div class="content">{{exercise.technique}}</div>
    </div>
    <div class="benefits_contraindications">
      <div class="contraindications">
        <h3>Противопоказания</h3>
        <div class="content">
          <li  class="contraindications_list" v-for="item in data.contraindications">{{ item }}</li>
        </div>
      </div>
      <div class="benefits">
        <h3>Польза</h3>
        <div class="content">
          <li class="benefits_list" v-for="item in data.benefit">{{ item }}</li>
        </div>
      </div>
    </div>
    <BasicButton label="Оставить отзыв" @click="goToReview"/>
    <ModalWindow @close="isOpenRemoveWindow=false" :closed-click-outside="true" :is-visible="isOpenRemoveWindow" class="remove-modal" title="Вы уверены, что хотите удалить асану из каталога?" subtitle="Отменить это действие будет невозможно" >
      <template #buttons>
        <div class="remove-modal__buttons">
          <BasicButton label="Удалить" class="modal-button" @click="removeAsana" />
          <BasicButton label="Отмена" theme="purple" class="modal-button" @click="isOpenRemoveWindow=false" />
        </div>
      </template>
    </ModalWindow>
  </div>
</template>

<style scoped lang="scss">
.wrapper{
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  & .header_bar{
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 2rem 9rem 1rem 9rem;
    width: 100%;
    & .title{
      text-align: center;
      width: 56%;
    }
    & .button{
      width: 22%;
    }
  }
  & .description_block{
    display: flex;
    flex-direction: row;
    width: 100%;
    padding: 1.5rem 15rem;
    & .stars_description{
      width: 50%;
      display: flex;
      flex-direction: column;
      & .stars{
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 40%;
        color: #FFA931;
      }
      & .description{
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 60%;
        h3{
          color: $brand;
          text-align: left;
        }
        & .content{
          font-size: 1.3rem;
          color: $brand;
        }
      }
    }
    img{
      object-fit: cover;
      height: 500px;
      width: 500px;
      border-radius: 1.8rem;
    }
  }
  & .technique{
    margin-bottom: 0.3rem;
    width: 100%;
    padding: 2.5rem 9rem;
    background-color: $brand;
    border-radius: 5rem;
    & .content{
      font-size: 1.3rem;
      margin-bottom: 1rem;
      color:  $light-brand;
    }
  }

  & .benefits_contraindications{
    display: flex;
    flex-direction: row;
    margin-bottom: 0.3rem;
    width: 100%;
    padding: 2.5rem 9rem;
    background-color: $brand;
    border-radius: 5rem;
    & .contraindications {
      margin-bottom: 0.3rem;
      width: 100%;
      padding: 1rem 2.5rem 2rem 2rem;
      background-color: $light-brand;
      border-radius: 5rem;
      & .contraindications_list {
        list-style-type: "\2715  ";
        line-height: 1.5;
      }
    }
    & .benefits {
      margin-bottom: 0.3rem;
      width: 100%;
      padding: 1rem 2.5rem 2rem 2rem;
      background-color: $light-brand;
      border-radius: 5rem;
      & .benefits_list {
        list-style-type: "\2713  ";
        line-height: 1.5;
      }
    }
    h3{
      color: $brand;
      text-align: center;
    }
    & .content{
      font-size: 1.5rem;
      color:  $brand;
    }
  }
}
.remove-modal{
  &__buttons{
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 0 100px;
    .modal-button{
      width:200px;
    }
  }
}
</style>w
