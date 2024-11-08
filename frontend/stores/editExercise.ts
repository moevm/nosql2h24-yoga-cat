import { defineStore } from 'pinia'
import type { Properties } from '~/types/exercise'

type ExerciseEditState = {
  isLoading: boolean,
  img: File | null,
  title: string,
  description: string,
  technique: string,
  contraindications: string[],
  benefit: string[],
  properties: Properties
}

export const useExerciseEditStore = defineStore({
  id: 'exerciseEditStore',
  state: (): ExerciseEditState => ({
    isLoading: false,
    img: null,
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
    }
  }),
  actions: {
    async loadExerciseData(id: string) {
      this.isLoading = true
      try {
        console.log("aaaaaaaa");
        const response = await fetch(`http://localhost:8080/exercises/${id}`)
        if (!response.ok) throw new Error(`Ошибка загрузки: ${response.statusText}`)
        const exerciseData = await response.json()
        this.title = exerciseData.title
        console.log("tot", this.title);
        this.description = exerciseData.description
        this.technique = exerciseData.technique
        console.log("texn", this.technique);
        this.contraindications = exerciseData.contraindications || []
        this.benefit = exerciseData.benefit || []
        this.img = exerciseData.img || null
        // Load properties values
        this.properties.spine.forEach((prop) => {
          prop.value = exerciseData.properties.spine.includes(prop.key)
        })
        this.properties.positionInSpace.forEach((prop) => {
          prop.value = exerciseData.properties.positionInSpace.includes(prop.key)
        })
        this.properties.loadAccent.forEach((prop) => {
          prop.value = exerciseData.properties.loadAccent.includes(prop.key)
        })
        this.properties.periphery.forEach((prop) => {
          prop.value = exerciseData.properties.periphery.includes(prop.key)
        })
      } catch (error) {
        console.error('Ошибка загрузки упражнения:', error)
      } finally {
        this.isLoading = false
      }
    },
    async updateExercise(id: string) {
      this.isLoading = true
      const filteredContraindications = this.contraindications.filter(item => item && item.trim() !== '')
      const filteredBenefit = this.benefit.filter(item => item && item.trim() !== '')

      const filteredProperties = {
        spine: this.properties.spine.filter(item => item.value).map(el => el.key),
        positionInSpace: this.properties.positionInSpace.filter(item => item.value).map(el => el.key),
        loadAccent: this.properties.loadAccent.filter(item => item.value).map(el => el.key),
        periphery: this.properties.periphery.filter(item => item.value).map(el => el.key),
      }

      const formData = new FormData()
      formData.append('title', this.title)
      formData.append('description', this.description)
      formData.append('technique', this.technique)
      formData.append('contraindications', JSON.stringify(filteredContraindications))
      formData.append('benefit', JSON.stringify(filteredBenefit))
      formData.append('properties', JSON.stringify(filteredProperties))

      if (this.img) {
        formData.append('img', this.img)
      }

      try {
        const response = await fetch(`http://localhost:8080/exercises/${id}`, {
          method: 'PUT',
          body: formData,
        })

        if (!response.ok) throw new Error(`Ошибка: ${response.statusText}`)
      } catch (error) {
        console.error('Ошибка при обновлении упражнения:', error)
      } finally {
        this.isLoading = false
      }
    }
  }
})
