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
                    key: ' STANDING_ON_FEET',
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
            const filteredContraindications = this.contraindications.filter(item => item && item.trim() !== "");
            const filteredBenefit = this.benefit.filter(item => item && item.trim() !== "");
            const filteredProperties = {
                spine: this.properties.spine.filter(item => item.value).map((el) => el.key),
                positionInSpace: this.properties.positionInSpace.filter(item => item.value).map((el => el.key)),
                loadAccent: this.properties.loadAccent.filter(item => item.value).map((el) => el.key),
                periphery: this.properties.periphery.filter(item => item.value).map((el) => el.key),
            };
            const convertImageToBase64 = (file: File): Promise<string> => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = error => reject(error);
                    reader.readAsDataURL(file);
                });
            };
            let imgBase64 = null;
            if (this.img) {
                imgBase64 = await convertImageToBase64(this.img);
            }
            const payload = {
                title: this.title,
                description: this.description,
                technique: this.technique,
                contraindications: filteredContraindications,
                benefit: filteredBenefit,
                properties: filteredProperties,
                img: imgBase64,
                reviews: []
            };
            const response = await fetch("http://localhost:8080/exercises", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error(`Ошибка: ${response.statusText}`);
        }
    }
})
