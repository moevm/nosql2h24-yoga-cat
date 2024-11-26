import { defineStore } from 'pinia';
import type { Review, Stars } from '~/types/exercise'
export type resultExercise = {
    id: string;
    title: string;
    reviews: Review[];
};

type searchReviewState = {
    minDate: Date | null;
    isLoading: boolean;
    exercises: resultExercise[];
    substring: string;
    authorName: string;
    minAuthorAge: string;
    maxAuthorAge: string;
    date: Date | null;
    stars: {key: Stars, value: boolean}[];
}

export const useReviewsSearchingStore = defineStore({
    id: 'reviewsSearchingStore',
    state: (): searchReviewState => ({
        minDate: null,
        isLoading: false,
        exercises: [],
        substring: '',
        authorName: '',
        minAuthorAge: '',
        maxAuthorAge: '',
        date: null,
        stars: [
            { key: 5, value: false },
            { key: 4, value: false },
            { key: 3, value: false },
            { key: 2, value: false },
            { key: 1, value: false },
        ],
    }),
    actions: {
        async applyFilters() {
            try {
                const queryString = this.getQueryString();
                const url = `http://localhost:8080/reviewfilter?${queryString}`;
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error status: ${response.status}`);
                }
                const responseData = await response.json()
                this.exercises = responseData.reviews;
            } catch (error) {
                console.error('Error:', error);
            }
        },
        async getStartDate(){
            try {
                const url = `http://localhost:8080/firstdate`;
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error status: ${response.status}`);
                }
                const responseData = await response.json()
                this.minDate = new Date(responseData.firstDate);
            } catch (error) {
                console.error('Error:', error);
            }
        },
        getQueryString() {
            const searchParams = new URLSearchParams();
            if(this.substring.length > 0){
                searchParams.append('substring', `${this.substring}`);
            }
            if(this.authorName.length > 0){
                searchParams.append('name', `${this.authorName}`);
            }
            if(this.minAuthorAge.length > 0 || this.maxAuthorAge.length > 0){
                const ageObject: any = {}
                if(this.minAuthorAge.length > 0){
                    ageObject['min'] = Number(this.minAuthorAge);
                }
                if(this.maxAuthorAge.length > 0){
                    ageObject['max'] = Number(this.maxAuthorAge);
                }
                searchParams.append('age', JSON.stringify(ageObject));
            }
            if(this.date && Array.isArray(this.date) && this.date.length===2){
                const dateObject: any = {}
                dateObject['min'] = this.date[0]
                dateObject['max'] = this.date[1]
                console.log(dateObject)
                searchParams.append('date', JSON.stringify(dateObject));
            }
            for (const star of this.stars) {
                if (star.value) {
                    searchParams.append('stars', `${star.key}`);
                }
            }
            return searchParams.toString();
        },
    }
})
