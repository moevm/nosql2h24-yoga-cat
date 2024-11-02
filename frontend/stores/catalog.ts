import { defineStore } from 'pinia';
import type { Exercise, Properties } from '~/types/exercise';
type FiltersState = {
  exercises: Exercise[]
  properties: Properties & {title: string};
  isLoading: boolean;
  pagination: {
    currentPage: number,
    totalPages: number,
  }
}

export const useCatalogStore = defineStore({
  id: 'catalogStore',
  state: (): FiltersState => ({
    isLoading: false,
    exercises: [],
    pagination: {
      currentPage: 1,
      totalPages: 0,
    },
    properties: {
      title: '',
      spine: [
        { key: 'DEFLECTION', value: false, title: 'Прогиб' },
        { key: 'INCLINE', value: false, title: 'Наклон' },
        { key: 'TWIST', value: false, title: 'Скрутка' },
        { key: 'LATERAL_TILT', value: false, title: 'Боковой наклон' },
      ],
      positionInSpace: [
        { key: 'STANDING_ON_HANDS', value: false, title: 'Стоя на руках' },
        { key: 'STANDING_ON_FEET', value: false, title: 'Стоя на ногах' },
        { key: 'SITTING', value: false, title: 'Сидя' },
        { key: 'LYING_ON_STOMACH', value: false, title: 'Лежа на животе' },
        { key: 'LYING_ON_BACK', value: false, title: 'Лежа на спине' },
        { key: 'LYING_ON_YOUR_SIDE', value: false, title: 'Лежа на боку' },
        { key: 'TURNED_OVER', value: false, title: 'Перевернутые' },
      ],
      loadAccent: [
        { key: 'STRENGTH', value: false, title: 'Силовая' },
        { key: 'FLEXIBILITY', value: false, title: 'Гибкостная' },
        { key: 'BALANCE', value: false, title: 'Балансовая' },
      ],
      periphery: [
        { key: 'OPENING_HIP_JOINTS', value: false, title: 'Раскрытие тазобедренных суставов' },
        { key: 'OPENING_SHOULDER_JOINTS', value: false, title: 'Раскрытие плечевых суставов' },
      ],
      stars: [
        { key: 5, value: false },
        { key: 4, value: false },
        { key: 3, value: false },
        { key: 2, value: false },
        { key: 1, value: false },
      ],
    },
  }),
  actions: {
    async applyFilters() {
      try {
        const queryString = this.getQueryString();
        const url = `http://localhost:8080/exercises?${queryString}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error status: ${response.status}`);
        }
        const responseData = await response.json()
        this.exercises = responseData.exercises;
        this.pagination.currentPage = +responseData.pagination.currentPage;
        this.pagination.totalPages = +responseData.pagination.totalPages;
        console.log(this.exercises);
      } catch (error) {
        console.error('Error:', error);
      }
    },
    getQueryString() {
      const searchParams = new URLSearchParams();
      const filterKeys: (keyof Properties)[] = [
        'spine',
        'positionInSpace',
        'loadAccent',
        'periphery',
        'stars',
      ];
      searchParams.append('page', `${this.pagination.currentPage}`);
      if (this.properties.title !== '') {
        searchParams.append('name', this.properties.title);
      }
      for (const filterCategory of filterKeys) {
        const filters = this.properties[filterCategory];
        if (filters) {
          for (const filter of filters) {
            if (filter.value) {
              searchParams.append(filterCategory, filter.key);
            }
          }
        }
      }

      return searchParams.toString();
    },

    resetFilters() {
      const filterKeys: (keyof Properties)[] = [
        'spine',
        'positionInSpace',
        'loadAccent',
        'periphery',
        'stars',
      ];
      for (const filterCategory of filterKeys) {
        const filters = this.properties[filterCategory];
        if (filters) {
          for (const filter of filters) {
            filter.value = false;
          }
        }
      }
    },
  },
});
