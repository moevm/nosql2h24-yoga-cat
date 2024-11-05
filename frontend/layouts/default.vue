<script setup lang="ts">
import {useRoute} from 'vue-router'
import {computed} from 'vue'
import Logo from "~/shared/ui/Logo.vue";
import NotificationMessages from "~/entities/NotificationMessages.vue";
import BasicButton from '~/shared/ui/BasicButton.vue';
const route = useRoute();
const isHomePage = computed(() => route.path === '/');
const isReviewPage = computed(() => route.path === '/feedback');
</script>

<template>
  <div class="page-wrapper" :class="{reviewPage: isReviewPage}">
    <div class="container">
      <div class="header">
        <NuxtLink to="/" class="logo"><Logo/></NuxtLink>
        <div class="links">
          <NuxtLink to="/catalog" class="links__link">Каталог упражнений</NuxtLink>
        </div>
      </div>
      <div class="page">
        <slot />
      </div>
      <div class="footer"  v-if="isHomePage">
        <BasicButton label="Импортировать данные" class="footer__button"></BasicButton>
        <BasicButton label="Экспортировать данные" class="footer__button"></BasicButton>
        <BasicButton label="Кастомизированная статистика" class="footer__button"></BasicButton>
      </div>
    </div>
    <NotificationMessages />
  </div>
</template>

<style scoped lang="scss">
.page-wrapper{
  flex-direction: column;
  display: flex;
  min-height: 100vh;
  height: 100%;
  width: 100%;
  background-color:$light-brand;
  &.reviewPage{
    background-color: #a49fb3;
  }
  @include thin-scrollbar;
  & .container{
    width: 100%;
    flex-grow: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    row-gap: 30px;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    max-width: 1600px;
    & .header{
      max-width: 1600px;
      z-index: 5;
      position: fixed;
      top: 0;
      width: 100%;
      align-items: center;
      justify-content: space-between;
      display: flex;
      padding: 20px 150px;
      background-color: $brand;
      border-radius: 0 0 90px 90px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
      & .links{
        display: flex;
        &__link{
          color: $light-brand;
          font-size: 1.25rem;
          font-weight: 400;
          transition: all 0.2s ease;
          &:hover{
            color: $purple;
          }
        }
      }
      & .logo{
        transition: all 0.2s ease;
        color: $light-brand;
        &:hover{
          color: $purple
        }
      }
    }
    & .page{
      flex-grow: 1;
      width: 100%;
      margin-top: 120px;
    }
    & .footer{
      width: 100%;
      bottom: 0;
      max-width: 1600px;
      padding: 2rem 9rem;
      justify-content: space-between;
      display: flex;
      border-radius: 90px 90px 0 0;
      background-color: $brand;
      margin-top: 0.25rem;
      &__button{
        font-size:1rem;
      }
    }
  }
}
</style>
