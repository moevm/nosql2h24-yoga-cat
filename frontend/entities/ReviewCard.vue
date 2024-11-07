<script setup lang="ts">
import StarIcon from "~/shared/icons/StarIcon.vue";
export type CardInfo = {
  name: string,
  stars: number,
  age: string,
  date: string,
  comment: string
}
defineProps<CardInfo>()
</script>

<template>
  <div class="wrapper">
    <p class="date-block">{{date}}</p>
    <div class="info-block">
      <div class="name-age">{{name+", "+age}}</div>
      <div class="stars-block">
        <StarIcon v-for="star in stars" :key="star" :width="`${22}`" :height="`${22}`"/>
      </div>
      <div class="comment-block">{{comment}}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrapper{
  max-width: 100%;
  padding: 0.5rem 1.5rem 1.5rem 1.5rem;
  position: relative;
  border-radius: 2.5rem;
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
  background-color: $light-brand;
  & .date-block{
    margin-left: auto;
    margin-right: 0;
    color: $brand
  }
  & .info-block{
    display: flex;
    flex-direction: column;
    row-gap: 0.5rem;
    width: 100%;
    & .name-age{
      color: $brand;
      font-size: 1.5rem;
      text-align: left;
    }
    & .stars-block{
      color: #FFA931;
      border-radius: 1rem;
      gap: 0.125rem;
      display: flex;
      top: 0.625rem;
      right: 1rem;
    }
    & .comment-block{
      color: $brand;
      font-size: 1.2rem;
      text-align: left;
    }
  }
}
</style>