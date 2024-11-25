<script setup lang="ts">
import BasicInput from "~/shared/ui/BasicInput.vue";
import BasicButton from '~/shared/ui/BasicButton.vue';
import ReviewCard from '~/entities/ReviewCard.vue'
import SearchIcon from "~/shared/icons/SearchIcon.vue";
import {storeToRefs} from "pinia";
import {useReviewsSearchingStore} from "~/stores/searchReview";
import { onBeforeMount, ref, onMounted , computed} from 'vue'
import Checkbox from '#shared/ui/Checkbox.vue'
import StarIcon from '#shared/icons/StarIcon.vue'
import CustomDatepicker from '#shared/ui/CustomDatepicker.vue'
const searchStore = useReviewsSearchingStore()
const {exercises, substring, authorName, minAuthorAge,maxAuthorAge, stars, date, minDate } = storeToRefs(searchStore);
const minAgeInput = ref()
const maxAgeInput = ref()
const applyFilters = async() => {
  try{
    const minAgeIsValid= minAgeInput.value?.validate()
    const maxAgeIsValid = maxAgeInput.value?.validate()
    if(minAgeIsValid && maxAgeIsValid){
      await searchStore.applyFilters();
    }
  }
  catch(err){
    console.log('error', err);
  }
}
const maxDate = computed(()=> {
  return new Date()
})
onMounted(async()=> {
  await searchStore.getStartDate();
})
onBeforeMount(()=> {
  searchStore.$reset()
})
</script>

<template>
  <div class="wrapper">
    <h1>Поиск асаны по отзывам</h1>
    <div class="search_bar">
      <BasicInput type="text" v-model="substring" placeholder="Текст отзыва" class="text_input"/>
      <BasicInput type="text" v-model="authorName" placeholder="Имя автора" class="text_input"/>
      <div class="stars-date-wrapper">
        <div class="stars-wrapper">
          <div class="title">Оценка</div>
          <div class="checkbox-wrapper stars">
            <div v-for="(item, idx) in stars" :key="item.key" class="wrapper-item">
              <div class="item" :class="{'left-side': idx < 3, 'right-side': idx >= 3}">
                <Checkbox  v-model="item.value"/>
                <span class="item__title">{{item.key}}</span>
                <div class="item__icon">
                  <StarIcon/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="date-button-wrapper">
          <CustomDatepicker :model-value="date" class="date" label="Даты публикации" @update:model-value="(newValue) => date = newValue" range :min-date="minDate" :maxDate="maxDate"/>
          <div class="age-block">
            <span class="age-title">Возраст автора</span>
            <div class="age-inputs">
              <BasicInput ref="minAgeInput" type="text" v-model="minAuthorAge" placeholder="От" class="text_input" :rules="[
                (val: string | number)=>(!val || !isNaN(parseInt(`${val}`)) ) || 'Введите число',
                (val: string | number)=> !val || (!isNaN(parseInt(`${val}`)) && (parseInt(`${val}`)>=16)) || 'Добавление отзыва разрешено только лицам старше 16 лет',
                (val: string | number) => !val || (!isNaN(parseInt(`${val}`)) && parseInt(`${val}`) >= 16 && (!isNaN(parseInt(`${maxAuthorAge}`)) && parseInt(`${maxAuthorAge}`) >= 16 && +maxAuthorAge > +val)) || (parseInt(`${maxAuthorAge}`) < 16 || !maxAuthorAge || 'Минимальный возраст должен быть меньше максимального')]"/>
              <BasicInput ref="maxAgeInput" type="text" v-model="maxAuthorAge" placeholder="До" class="text_input" :rules="[(val: string | number)=>(!val || !isNaN(parseInt(`${val}`)) ) || 'Введите число',(val: string | number)=> !val || (!isNaN(parseInt(`${val}`)) && (parseInt(`${val}`)>=16)) || 'Добавление отзыва разрешено только лицам старше 16 лет' ]"/>
            </div>
          </div>
        </div>
      </div>
      <BasicButton class="search_btn" @click="applyFilters">
        <template #after>
          <span class="after">
            <span class="after-text">Найти</span>
            <SearchIcon/>
          </span>
        </template>
      </BasicButton>
    </div>
    <div v-if="exercises.length > 0" class="result_block">
      <h3>Найдено по Вашему запросу</h3>
      <div v-for="item in exercises" class="exercise_res" :key="item.id">
        <div class="header">
          <div class="title">На асану: {{item.title}}</div>
          <NuxtLink class="button" :to="`/catalog/${item.id}`">
            <BasicButton label="ПЕРЕЙТИ"></BasicButton>
          </NuxtLink>
        </div>
        <div class="review_content">
          <ReviewCard v-for="el in item.reviews" :name="el.name" :key="el._id" :stars="el.rating" :age="el.age" :date="el.date" :comment="el.comment"/>
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
    flex-direction: column;
    row-gap: 12px;
    width: 40%;
    margin-bottom: 4rem;
    & .text_input{
      width: 100%;
    }
    & .search_btn{
      margin: 0 auto;
      width: 100%;
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
  gap: 10px;
  align-items: center;
  justify-content: center;
  &-text{
    font-size: 18px;
  }
}
.stars-date-wrapper{
  height: fit-content;
  display: flex;
  gap: 16px;
  .date{
    height: fit-content;
    width: 100%;
    transition: all 0.2s ease;
    &:hover{
      background-color: #e6dbea;
    }
  }
}
.stars-wrapper{
  height: fit-content;
  color: #6e5a73;
  width: fit-content;
  border: 2px solid $brand;
  border-radius: 30px;
  padding: 10px 15px 15px;
  flex-direction: column;
  display: flex;
  row-gap: 12px;
}
.checkbox-wrapper{
  width: fit-content;
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
  &.stars{
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 10px;
  }
  .left-side {
    grid-column: 1;
  }

  .right-side {
    grid-column: 2;
  }
  & .item{
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: fit-content;
    &__icon{
      color: #FFA931;
    }
  }
}
.date-button-wrapper{
  justify-content: center;
  width: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 12px;
  .age-block{
    display: flex;
    flex-direction: column;
    row-gap: 0.5rem;
    color: $brand;
    .age-title{
    }
    .age-inputs{
      display: flex;
      gap: 0.5rem;
      justify-content: space-between;
    }
  }
}
</style>
