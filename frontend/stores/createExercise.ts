import {defineStore} from 'pinia'
import type { Properties } from '~/types/exercise';

type exerciseCreateState = {
    isLoading: boolean,
    img: File | null,
    title: string,
    description: string,
    technique: string,
    contraindications: string[],
    benefit: string[],
    properties: Properties
}

export const useExerciseCreateStore = defineStore({
    id: 'exerciseCreateStore',
    state: (): exerciseCreateState => ({
        isLoading: false,
        img: null,
        title: '',
        description: '',
        technique: '',
        contraindications: [],
        benefit: [],
        properties: {
            spine: [{
                key: 'DEFLECTION',
                value: false,
                title: 'Прогиб'
            }, {
                key: 'INCLINE',
                value: false,
                title: 'Наклон'
            }, {
                key: 'TWIST',
                value: false,
                title: 'Скрутка'
            }, {
                key: 'LATERAL_TILT',
                value: false,
                title: 'Боковой наклон'
            }],
            positionInSpace: [
                {
                    key: 'STANDING_ON_HANDS',
                    value: false,
                    title: 'Стоя на руках'
                }, {
                    key: 'STANDING_ON_FEET',
                    value: false,
                    title: 'Стоя на ногах'
                }, {
                    key: 'SITTING',
                    value: false,
                    title: 'Сидя'
                }, {
                    key: 'LYING_ON_STOMACH',
                    value: false,
                    title: 'Лежа на животе'
                }, {
                    key: 'LYING_ON_BACK',
                    value: false,
                    title: 'Лежа на спине'
                }, {
                    key: 'LYING_ON_YOUR_SIDE',
                    value: false,
                    title: 'Лежа на боку'
                }, {
                    key: 'TURNED_OVER',
                    value: false,
                    title: 'Перевернутые'
                }
            ],
            loadAccent: [
                {key: 'STRENGTH', value: false, title: 'Силовая'},
                {key: 'FLEXIBILITY', value: false, title: 'Гибкостная'},
                {key: 'BALANCE', value: false, title: 'Балансовая'}],
            periphery: [
                {key: 'OPENING_HIP_JOINTS', value: false, title: 'Раскрытие тазобедренных суставов'},
                {key: 'OPENING_SHOULDER_JOINTS', value: false, title: 'Раскрытие плечевых суставов'}],
        }
    }),
    actions: {
        async createExercise() {
            this.isLoading = true;
            const filteredContraindications = this.contraindications.filter(item => item && item.trim() !== '');
            const filteredBenefit = this.benefit.filter(item => item && item.trim() !== '');

            const filteredProperties = {
                spine: this.properties.spine.filter(item => item.value).map((el) => el.key),
                positionInSpace: this.properties.positionInSpace.filter(item => item.value).map((el) => el.key),
                loadAccent: this.properties.loadAccent.filter(item => item.value).map((el) => el.key),
                periphery: this.properties.periphery.filter(item => item.value).map((el) => el.key),
            };

            // Создание FormData
            const formData = new FormData();
            formData.append('title', this.title);
            formData.append('description', this.description);
            formData.append('technique', this.technique);
            formData.append('contraindications', JSON.stringify(filteredContraindications)); // Преобразуем в строку
            formData.append('benefit', JSON.stringify(filteredBenefit)); // Преобразуем в строку
            formData.append('properties', JSON.stringify(filteredProperties)); // Преобразуем в строку

            // Если есть изображение, добавляем его в FormData
            if (this.img) {
                formData.append('img', this.img); // добавляем файл изображения
            }
            console.log('formData', formData);
            try {
                const response = await fetch('http://localhost:8080/exercises', {
                    method: 'POST',
                    body: formData, // Отправляем FormData
                });

                if (!response.ok) throw new Error(`Ошибка: ${response.statusText}`);
            } catch (error) {
                console.error('Ошибка при создании упражнения:', error);
            } finally {
                this.isLoading = false;
            }
        }
    }
})
