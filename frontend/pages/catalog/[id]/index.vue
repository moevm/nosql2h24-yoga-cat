<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import {onMounted, ref, computed} from 'vue';
import { storeToRefs } from 'pinia';
import { useExerciseStore } from '~/stores/showExercise';
import { useReviewStore } from '~/stores/showReviews';
import BasicButton from '~/shared/ui/BasicButton.vue';
import StarIcon from "~/shared/icons/StarIcon.vue";
import ModalWindow from '~/entities/ModalWindow.vue';
import ReviewCard from '~/entities/ReviewCard.vue'
import Checkbox from "#shared/ui/Checkbox.vue";
const route = useRoute();
const router = useRouter();
const asanaId = route.params.id;
const isOpenRemoveWindow = ref(false)
const exerciseStore = useExerciseStore();
const reviewsStore = useReviewStore();
const {reviews} = storeToRefs(reviewsStore);
const {exercise} = storeToRefs(exerciseStore);
const data = computed(()=>exercise.value);
const reviewsData = computed(()=>reviews.value.slice(0,3));
const define = {
  'DEFLECTION': 'Прогиб',
  'INCLINE': 'Наклон',
  'TWIST': 'Скрутка',
  'LATERAL_TILT': 'Боковой наклон',
  'STANDING_ON_HANDS': 'Стоя на руках',
  'STANDING_ON_FEET': 'Стоя на ногах',
  'SITTING': 'Сидя',
  'LYING_ON_STOMACH': 'Лежа на животе',
  'LYING_ON_BACK': 'Лежа на спине',
  'LYING_ON_YOUR_SIDE': 'Лежа на боку',
  'TURNED_OVER': 'Перевернутые',
  'STRENGTH': 'Силовая',
  'FLEXIBILITY': 'Гибкостная',
  'BALANCE': 'Балансовая',
  'OPENING_HIP_JOINTS': 'РАскрытие тазобедренных суставов',
  'OPENING_SHOULDER_JOINTS': 'Раскрытие плечевых суставов'
}
const goToReviews = async ()=> {
  await router.push(`/catalog/${route.params.id}/reviews`);
}
const removeAsana = async () => {
  if(Array.isArray(asanaId)) await exerciseStore.removeExercise(asanaId[0])
  else await exerciseStore.removeExercise(asanaId)
  isOpenRemoveWindow.value = false;
  await router.push('/catalog')
}
onMounted(async ()=> {
  await exerciseStore.getExercise(asanaId);
  await reviewsStore.getReviews(asanaId);
  console.log(exercise.value.properties.spine)
})
</script>

<template>
  <div class="wrapper">
    <div class="header_bar">
      <NuxtLink class="button" :to="`/catalog/${route.params.id}/edit`">
        <BasicButton label="Редактировать асану"/>
      </NuxtLink>
      <h1 class="title">{{exercise.title}}</h1>
      <BasicButton class="button" label="Удалить асану" @click="()=> isOpenRemoveWindow = true"/>
    </div>
    <div class="description_block">
      <div class="stars_description">
        <div class="stars"><StarIcon v-for="star in (+exercise.rating || 0) " :key="star" width="50" height="50"/></div>
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
    <div class="properties_block">
      <div class="review_header">
        <h3>Характеристики</h3>
      </div>
      <div class="properties_wrapper">
        <div class="spine">
          <div class="title">Позвоночник</div>
          <div class="property_wrapper">
            <div class="item" v-for="(item) in exercise.properties.spine">
              <li class="item_title">{{define[item]}}</li>
            </div>
          </div>
        </div>
        <div class="positionInSpace">
          <div class="title">Положение в пространстве</div>
          <div class="property_wrapper">
            <div class="item" v-for="(item) in exercise.properties.positionInSpace" :key="item.title">
              <li class="item_title">{{define[item]}}</li>
            </div>
          </div>
        </div>
        <div class="load">
          <div class="loadAccent">
            <div class="title">Акценты нагрузки</div>
            <div class="property_wrapper">
              <div class="item" v-for="(item) in exercise.properties.loadAccent" :key="item.title">
                <li class="item_title">{{define[item]}}</li>
              </div>
            </div>
          </div>
        </div>
        <div class="periphery">
          <div class="title">Периферия</div>
          <div class="property_wrapper">
            <div class="item" v-for="(item) in exercise.properties.periphery" :key="item.title">
              <li class="item_title">{{define[item]}}</li>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="review_block">
      <div class="review_header">
        <h3>Отзывы</h3>
        <NuxtLink :to="`/catalog/${route.params.id}/feedback`" class="link">Оставить отзыв</NuxtLink>
      </div>
      <div class="review_content">
        <ReviewCard v-for="item in reviewsData" :name="item.name" :stars="item.rating" :age="item.age" :date="item.date" :comment="item.comment"/>
      </div>
      <br>
      <BasicButton class="show_review_bth" @click="goToReviews" label="Смотреть всё"/>
    </div>
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
      object-fit: contain;
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
      margin-right: 1rem;
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
  .properties_block{
    display: flex;
    flex-direction: column;
    margin-bottom: 0.3rem;
    width: 100%;
    padding: 2.5rem 9rem;
    background-color: $brand;
    border-radius: 5rem;
    .properties_wrapper {
      min-width: 1000px;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      width: 100%;
      margin-top: 1rem;

      .title {
        font-size: 1.5rem;
        margin-bottom: 1rem;
        color: $light-brand;
      }

      .property_wrapper {
        width: fit-content;
        display: flex;
        flex-direction: column;
        row-gap: 0.5rem;

        .item {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          width: fit-content;
          .item_title {
            color: $light-brand;
            font-size: 1.2rem;
          }
        }
      }
    }
  }
  & .review_block{
    background-color: $brand;
    border-radius: 5rem 5rem 0 0;
    width: 100%;
    padding: 2.5rem 9rem;
    & .review_content{
      width: 100%;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      row-gap: 2.5rem;
      column-gap: 0.7rem;
    }
    & .review_header{
      width: 100%;
      display: flex;
      flex-direction: row;
      & .link{
        margin: auto 0 0 auto;
        color: $light-brand;
        font-size: 1.8rem;
        font-weight: 400;
        text-decoration: underline;
        &:hover{
          color: $purple;
        }
      }
    }
    & .show_review_bth{
      width: 33.3%;
      margin-left: 33.3%;
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
