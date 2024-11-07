<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import {onMounted} from 'vue';
import { storeToRefs } from 'pinia';
import { useExerciseStore } from '~/stores/showExercise';
import { useReviewStore } from '~/stores/showReviews';
import BasicButton from '~/shared/ui/BasicButton.vue';
import ReviewCard from '~/entities/ReviewCard.vue'
const route = useRoute();
const router = useRouter();
const asanaId = route.params.id;
const exerciseStore = useExerciseStore();
const reviewsStore = useReviewStore();
const {reviews} = storeToRefs(reviewsStore);
const {exercise} = storeToRefs(exerciseStore);
const goToReview = async ()=> {
  await router.push(`/catalog/${route.params.id}/feedback`);
}
onMounted(async ()=> {
  await exerciseStore.getExercise(asanaId);
  await reviewsStore.getReviews(asanaId);
})
</script>

<template>
  <div class="wrapper">
    <h1>Отзывы на асану</h1>
    <h1>{{exercise.title}}</h1>
    <img :src="exercise.img" :alt="exercise.title">
    <BasicButton class="btn" @click="goToReview">Оставить отзыв</BasicButton>
    <div class="reviews_block">
      <h3>Отзывы</h3>
      <ReviewCard v-for="item in reviews" :name="item.name" :stars="item.rating" :age="item.age" :date="item.date" :comment="item.comment"/>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  img{
    object-fit: cover;
    height: 400px;
    width: 400px;
    border-radius: 1.8rem;
    margin: 1.5rem;
    border: 3px solid $brand;
  }
  & .btn{
    background-color: $brand;
    color: $light-brand;
    width: 26.5%;
  }
  & .reviews_block{
    margin-top: 2rem;
    width: 100%;
    padding: 2rem 9rem 2.5rem 9rem;
    background-color: $brand;
    border-radius: 5rem 5rem 0 0;
    column-gap: 2.5rem;
  }
}
</style>