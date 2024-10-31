<script setup lang="ts">
import StarIcon from "~/shared/icons/StarIcon.vue";
import BasicButton from '~/shared/ui/BasicButton.vue';
export type CardInfo = {
  id: number,
  img: string,
  stars: number,
  name: string,
  description: string,
}
defineProps<CardInfo>()
</script>

<template>
  <div class="wrapper-card">
    <div class="wrapper-info">
      <img :src="img" :alt="name">
      <div class="about">
        <span class="about__title">{{name}}</span>
        <div class="about__description">{{description}}</div>
      </div>
      <div class="stars-block">
        <StarIcon v-for="star in stars" :key="star"/>
      </div>
    </div>
    <NuxtLink :to="`catalog/${id}`">
      <BasicButton label="Подробнее" class="more-info-button"/>
    </NuxtLink>

  </div>

</template>

<style scoped lang="scss">
.wrapper-card{
  width: fit-content;
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
  align-items: center;
  .more-info-button{
    padding: 10px;
    width: 200px;
  }
}
.wrapper-info{
  height: 450px;
  position: relative;
  max-width: 21rem;
  width: 100%;
  border-radius: 1.8rem;
  display: flex;
  flex-direction: column;
  background-color: $light-brand;
  img{
    object-fit: cover;
    height: 60%;
    width: 100%;
    border-radius: 1.8rem;

  }
  .about {
    color: $brand;
    padding: 0.8rem;

    &__title {
      font-weight: 400;
      font-size: 1.6rem;
    }

    &__description {
      font-size: 1rem;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.2rem;
      -webkit-line-clamp: 5;
    }
  }

  .stars-block{
    flex-direction: row-reverse;
    gap: 0.125rem;
    display: flex;
    top: 0.625rem;
    right: 1rem;
    position: absolute;
  }
}
</style>
