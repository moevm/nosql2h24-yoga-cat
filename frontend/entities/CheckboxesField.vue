<script setup lang="ts">
import type {Properties} from "~/types/exercise";
import Checkbox from "~/shared/ui/Checkbox.vue";
import StarIcon from '~/shared/icons/StarIcon.vue';

type Props =  {
  theme?: 'purple' | 'light',
  properties: Properties

}
defineProps<Props>()
</script>

<template>
  <div class="checkboxes-wrapper" :class="theme">
    <div class="spine">
      <div class="title">Позвоночник</div>
      <div class="checkbox-wrapper">
        <div class="item" v-for="(item) in properties.spine" :key="item.title">
          <Checkbox  v-model="item.value" :theme="theme"/>
          <span class="item__title">{{item.title}}</span>
        </div>
      </div>
    </div>
    <div class="positionInSpace">
      <div class="title">Положение в пространстве</div>
      <div class="checkbox-wrapper">
        <div class="item" v-for="(item) in properties.positionInSpace" :key="item.title">
          <Checkbox  v-model="item.value" :theme="theme"/>
          <span class="item__title">{{item.title}}</span>
        </div>
      </div>
    </div>
    <div class="load-stars">
      <div class="loadAccent">
        <div class="title">Акценты нагрузки</div>
        <div class="checkbox-wrapper">
          <div class="item" v-for="(item) in properties.loadAccent" :key="item.title">
            <Checkbox  v-model="item.value" :theme="theme"/>
            <span class="item__title">{{item.title}}</span>
          </div>
        </div>
      </div>
      <div class="stars" v-if="properties.stars">
        <div class="title">Оценка</div>
        <div class="checkbox-wrapper stars">
          <div v-for="(item, idx) in properties.stars" :key="item.key" class="wrapper-item">
            <div class="item" :class="{'left-side': idx < 3, 'right-side': idx >= 3}">
              <Checkbox  v-model="item.value" :theme="theme"/>
              <span class="item__title">{{item.key}}</span>
              <div class="item__icon">
                <StarIcon/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="periphery">
      <div class="title">Периферия</div>
      <div class="checkbox-wrapper">
        <div class="item" v-for="(item) in properties.periphery" :key="item.title">
          <Checkbox  v-model="item.value" :theme="theme"/>
          <span class="item__title">{{item.title}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.checkboxes-wrapper{
  min-width: 1000px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  width: 100%;
  .title{
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  .load-stars{
    display: flex;
    flex-direction: column;
    row-gap: 2rem;
  }
  .checkbox-wrapper{
    width: fit-content;
    display: flex;
    flex-direction: column;
    row-gap: 0.5rem;
    &.stars{
      display: grid;
      grid-template-columns: 1fr 1fr; /* две колонки */
      grid-gap: 10px; /* отступ между элементами */
    }
    .left-side {
      grid-column: 1; /* элементы в левой колонке */
    }

    .right-side {
      grid-column: 2; /* элементы в правой колонке */
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

  &.purple{
    .title, .item{
      color: $brand;
    }
  }
  &.light{
    .title, .item{
      color: $light-brand;
    }
  }
}
</style>
