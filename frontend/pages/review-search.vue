<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import {onMounted} from 'vue';
import BasicInput from "~/shared/ui/BasicInput.vue";
import BasicButton from '~/shared/ui/BasicButton.vue';
import ReviewCard from '~/entities/ReviewCard.vue'
import SearchIcon from "~/shared/icons/SearchIcon.vue";
import {storeToRefs} from "pinia";
import {useReviewsSearchingStore} from "~/stores/searchReview";
const searchStore = useReviewsSearchingStore()
const {isLoading, exercises, substring} = storeToRefs(searchStore);
const type = [
  {id: 'qwertyu', title: 'Халасана', reviews: [
      {name: 'Олег', age: '24', rating: 4, comment: 'qwerty', date: '2024-11-06T17:29:56.270Z'},
      {name: 'Ольга', age: '30', rating: 5, comment: 'test comment', date: '2024-11-06T20:53:16.678Z'},
      {name: 'Testuser', age: '19', rating: 5, comment: 'iulasndiuskhcankxnc iusnkxcjnoi;c kdnsc ksdnckx kjdnscx dkjnsCCxjzn dizcdiozxc kdnzxcildx', date: '2024-11-07T08:40:00.277Z'},
      {name: 'qwerty', age: '40', rating: 4, comment: 'qwerty78', date: '2024-11-07T08:42:26.332Z'}
    ]},
  {id: 'skdncsdc', title: 'Пинча Маюрасана', reviews: [
      {name: 'Олег', age: '24', rating: 4, comment: 'qwerty', date: '2024-11-06T17:29:56.270Z'},
      {name: 'Ольга', age: '30', rating: 5, comment: 'test comment', date: '2024-11-06T20:53:16.678Z'},
    ]}
];

const applyFilters = async() => {
  try{
    await searchStore.applyFilters();
  }
  catch(err){
    console.log('error', err);
  }
}
</script>

<template>
  <div class="wrapper">
    <h1>Поиск асаны по отзывам</h1>
    <div class="search_bar">
      <BasicInput type="text" v-model="substring" placeholder="Текст отзыва" class="text_input"/>
      <BasicButton class="search_btn" @click="applyFilters">
        <template #after>
          <span class="after">
            <SearchIcon/>
          </span>
        </template>
      </BasicButton>
    </div>
    <div v-if="type.length > 0" class="result_block">
      <h3>Найдено по Вашему запросу</h3>
      <div v-for="item in type" class="exercise_res">
        <div class="header">
          <div class="title">На асану: {{item.title}}</div>
          <BasicButton class="button" label="ПЕРЕЙТИ"></BasicButton>
        </div>
        <div class="review_content">
          <ReviewCard v-for="el in item.reviews" :name="el.name" :stars="el.rating" :age="el.age" :date="el.date" :comment="el.comment"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  h1{
    margin: 1rem 0 2rem 0;
  }
  & .search_bar{
    display: flex;
    flex-direction: row;
    width: 60%;
    margin-bottom: 4rem;
    & .text_input{
      width: 100%;
    }
    & .search_btn{
      margin-left: 1rem;
      background-color: $brand;
      color: $light-brand;
    }
  }
  & .result_block{
    background-color: $brand;
    border-radius: 5rem 5rem 0 0;
    width: 100%;
    padding: 2.5rem 9rem;
    & .exercise_res{
      margin-top: 2.5rem;
      & .header{
        display: flex;
        flex-direction: row;
        & .title{
          font-size: 2.5rem;
          color: $light-brand;
        }
        & .button{
          width: 20%;
          margin-left: 2.5rem;
        }
      }
      & .review_content{
        width: 100%;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        column-gap: 0.7rem;
      }
    }
  }
}
.after{
  display: flex;
  align-items: center;
}
</style>