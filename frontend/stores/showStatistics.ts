import {defineStore} from 'pinia'
import type { StatisticType } from '~/types/exercise';

type showStatisticsState = {
    type: StatisticType;
    date: Date[] | null;
    exercise_id: string;
    cur_type: StatisticType;
    labels: string[];
    data: number[];
    loadAccent: any[];
    periphery: any[];
    positionInSpace: any[];
    spine: any[];
}

export const useStatisticsStore = defineStore({
    id: 'statisticsStore',
    state: (): showStatisticsState => ({
        type: 'BASIC',
        date: null,
        exercise_id: '',
        labels: [],
        data: [],
        loadAccent: [],
        periphery: [],
        positionInSpace: [],
        spine: [],
        cur_type: 'BASIC',
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
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        exercise_id: this.exercise_id,
                        date: this.date,
                        type: this.type,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`Ошибка: ${response.statusText}`);
                }
                this.cur_type = this.type;
                const responseData = await response.json();
                if(this.type=='STARS'){
                    this.data = responseData.counts;
                    this.labels = responseData.ratings;
                }
                else if(this.type=='DYNAMIC'){
                    this.data = responseData.ratings;
                    this.labels = responseData.dates;
                }
                else if(this.type=='ASANAS_COUNT' || this.type=='REVIEWS_COUNT'){
                    this.data = responseData.counts;
                    this.labels = responseData.dates;
                }
                else if(this.type=='PERCENT'){
                    this.loadAccent = responseData.loadAccent;
                    this.periphery = responseData.periphery;
                    this.positionInSpace = responseData.positionInSpace;
                    this.spine = responseData.spine;
                }
            } catch (error) {
                console.error('Ошибка при получении статистики:', error);
            }
        }
    }
})
