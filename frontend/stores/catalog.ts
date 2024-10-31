import { defineStore } from 'pinia';
import type { Properties } from '~/types/exercise';

type FiltersState = {
  properties: Properties;
}

export const useFiltersStore = defineStore({
  id: 'filtersStore',
  state: (): FiltersState => ({
    properties: {
      name: '',
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
    applyFilters() {
      const queryString = this.getQueryString();
      console.log('q0', queryString);
      const url = `http://localhost:8080/exercises?${queryString}`;
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log(data);
        })
        .catch(error => {
          console.error('Error:', error);
        });
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

      if (this.properties.name !== '') {
        searchParams.append('name', this.properties.name);
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
