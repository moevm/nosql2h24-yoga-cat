import {defineStore} from 'pinia'
import type { StatisticType } from '~/types/exercise';

type showStatisticsState = {
    type: StatisticType;
    date: Date[];
    exercise_id: string;
    header: string;
    description: string;
    labels: string[];
    data: number[];
    legend: string[];
}

export const useStatisticsStore = defineStore({
    id: 'statisticsStore',
    state: (): showStatisticsState => ({
        type: 'BASIC',
        date: [],
        exercise_id: '',
        header: '',
        description: '',
        labels: [],
        data: [],
        legend: [],
    }),
    actions: {
        async getStatistics() {
            const formData = new FormData();
            formData.append('type', this.type);
            formData.append('date', JSON.stringify(this.date));
            formData.append('exercise_id', this.exercise_id);

            try {
                const response = await fetch('http://localhost:8080/statistics', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error(`Ошибка: ${response.statusText}`);
                }
                const responseData = await response.json()
                this.header = responseData.header;
                this.description = responseData.description;
                this.labels = responseData.labels;
                this.data = responseData.data;
                this.legend = responseData.legend;
            } catch (error) {
                console.error('Ошибка при получении статистики:', error);
            }
        }
    }
})