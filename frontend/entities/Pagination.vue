<template>
  <div class="pagination" v-if="totalPages > 1">
    <span v-if="currentPage > 1 && totalPages>3" class="pagination__arrow" @click="changePage(currentPage - 1)">&lt;</span>
    <span
      v-for="page in visiblePages"
      :key="page"
      class="pagination__number"
      :class="{ active: page === currentPage }"
      @click="changePage(page)"
    >
      {{ page }}
    </span>
    <span v-if="currentPage < totalPages && totalPages>3" class="pagination__arrow" @click="changePage(currentPage + 1)">&gt;</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['update:currentPage']);

const visiblePages = computed(() => {
  const pagesArray = [];
  if (props.currentPage > 1) {
    pagesArray.push(props.currentPage - 1);
  }

  pagesArray.push(props.currentPage);
  if (props.currentPage < props.totalPages) {
    pagesArray.push(props.currentPage + 1);
  }
  return pagesArray.filter((page) => page > 0 && page <= props.totalPages).slice(-3);
});

const changePage = (page: number) => {
  console.log('ch', page);
  if (page > 0 && page <= props.totalPages) {
    emit('update:currentPage', page);
  }
};
</script>

<style scoped lang="scss">
.pagination {
  border-radius: 30px;
  margin: 0 auto;
  min-width: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: #f8f8f8;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.pagination__arrow {
  font-size: 24px;
  cursor: pointer;
  margin: 0 0.5rem;
  padding: 0.5rem;
  font-weight: bold;
  color: $brand;
  transition: color 0.3s;
}

.pagination__arrow:hover {
  color: #4f3f53;
}

.pagination__number {
  cursor: pointer;
  margin: 0 0.3rem;
  border-radius: 30px;
  text-align: center;
  min-width: 50px;
  padding: 10px;
  color: $brand;
}

.pagination__number:hover {
  background-color: #e2e6ea; /* Цвет при наведении */
}

.pagination__number.active {
  font-weight: bold;
  background-color: $brand; /* Цвет активной страницы */
  color: white; /* Цвет текста активной страницы */
}
</style>
