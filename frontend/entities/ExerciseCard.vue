<script setup lang="ts">
import StarIcon from "~/shared/icons/StarIcon.vue";
import BasicButton from '~/shared/ui/BasicButton.vue';
export type CardInfo = {
  id: string,
  img: string,
  stars: number,
  name: string,
  description: string,
  dateUpdate: any,
  dateAdd: any,
}

defineProps<CardInfo>()
function formatDate(date2: string) {
  const date = new Date(date2);
  if(date){
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(2); // берем последние 2 цифры года
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}.${month}.${year} - ${hours}:${minutes}`;
  }

}
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
      <div class="date-block">
        <div class="date-update" v-if="dateAdd">Создано: {{formatDate(dateAdd)}}</div>
        <div class="date-create" v-if="dateUpdate">Обновлено: {{formatDate(dateUpdate)}}</div>
      </div>
    </div>
    <NuxtLink :to="`catalog/${id}`">
      <BasicButton label="Подробнее" class="more-info-button"/>
    </NuxtLink>

  </div>

</template>

<style scoped lang="scss">
.date-block{
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.wrapper-card{
  width: fit-content;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  row-gap: 0.5rem;
  align-items: center;
  .more-info-button{
    padding: 10px;
    width: 200px;
  }
}
.wrapper-info{
  width: 300px;
  padding-top: 60px;
  height: 400px;
  position: relative;
  max-width: 21rem;
  border-radius: 1.8rem;
  display: flex;
  flex-direction: column;
  background-color: $light-brand;
  img{
    object-fit: contain;
    height: 65%;
    width: 100%;
    border-radius: 1.8rem;

  }
  .about {
    color: $brand;
    padding: 0.8rem;

    &__title {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      max-width: 100%;
      display: inline-block;
      font-weight: 400;
      font-size: 1.6rem;
    }

    &__description {
      word-wrap: break-word;
      font-size: 1rem;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.2rem;
      -webkit-line-clamp: 3;
    }
  }

  .stars-block{
    color: #FFA931;
    border-radius: 1rem;
    flex-direction: row-reverse;
    gap: 0.125rem;
    display: flex;
    top: 0.8rem;
    right: 1rem;
    position: absolute;
  }
  .date-block{
    position: absolute;
    top: 0.5rem;
    display: flex;
    flex-direction: column;
    row-gap: 2px;
    font-size: 12px;
    color: $brand;
    left: 1rem;
  }
}
</style>
