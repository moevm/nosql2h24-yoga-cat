import { defineStore } from 'pinia';
import type {Exercise} from '~/types/exercise';
type showExerciseState = {
    exercise: Exercise;
    isLoading: boolean;
}

export const useExerciseStore = defineStore({
    id: 'exerciseStore',
    state: (): showExerciseState => ({
        isLoading: false,
        exercise: {
            _id: '',
            img: '',
            title: '',
            description: '',
            technique: '',
            contraindications: [],
            benefit: [],
            properties: {
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
            }
        }
    }),
    actions: {
        async getExercise(id: string | string[]) {
            try {
                const url = `http://localhost:8080/exercises/${id}`;
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error status: ${response.status}`);
                }
                const responseData = await response.json()
                this.exercise = responseData;
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }
});