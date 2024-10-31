<script setup lang="ts">
import BasicButton from "~/shared/ui/BasicButton.vue";
import ExerciseCard from "~/entities/ExerciseCard.vue";
</script>

<template>
  <div class="wrapper">
    <div class="banner">
      <img src="@/public/assets/images/big-logo.svg" alt="banner__big-logo" class="banner__big-logo">
      <img src="@/public/assets/images/teacher.png" alt="teacher" class="banner__teacher">
    </div>
    <NuxtLink to="/catalog" class="catalog-button">
      <BasicButton label="Каталог упражнений"></BasicButton>
    </NuxtLink>
    <div class="popular">
      <div class="head">
        <h3 class="head__title">Популярное</h3>
        <NuxtLink to="/create">
          <BasicButton label="Добавить асану" class="head__add-button"/>
        </NuxtLink>
      </div>
      <div class="content">
        <ExerciseCard img="https://thecity.m24.ru/b/d/SYketSivfYw9L_TObLLBFlFNHBpuaXnwmJxNbycGshjv55OD3HWFWh2pL8EsPwl5DpSHzm95vRzNbdeHauL5EWcJ5w9e=Q_sEnzWUZFpc7IFUmL-h6A.jpg" name="Халасана" description="Халасана — перевод с санскрита, принципы травмобезопасности и польза от асаны. Что будет, если выполнять позу плуга регулярно перевод с санскрита, принципы травмобезопасности и польза от асаны. перевод с санскрита, принципы травмобезопасности и польза от асаны." :stars="4" :id="4"/>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrapper{
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  .banner {
    position: relative;
    display: flex;
    flex-direction: column;
    &__big-logo{
      height: 450px;
    }
    &__teacher{
      width: 400px;
      left:50%;
      transform: translateX(-50%);
      position: absolute;
      bottom: 0;
    }
  }
  .catalog-button{
    margin-bottom: 3rem;
    max-width: 1000px;
    width: 100%;
    :deep(.basic) {
      width: 100%;
      padding: 1.5rem;
    }
  }
  .popular{
    width: 100%;
    padding: 4rem 9rem;
    background-color: $brand;
    border-radius: 90px;
    .head{
      margin-bottom: 2.5rem;
      display: flex;
      justify-content: space-between;
      &__add-button{
        font-size: 1rem;
      }
    }

  }
}

</style>
