import { defineStore } from 'pinia';
import type { Review, Stars } from '~/types/exercise'
export type resultExercise = {
    id: string;
    title: string;
    reviews: Review[];
};

type searchReviewState = {
    isLoading: boolean;
    exercises: resultExercise[];
    substring: string;
    authorName: string;
    authorAge: string;
    date: Date | null;
    stars: {key: Stars, value: boolean}[];
}

export const useReviewsSearchingStore = defineStore({
    id: 'reviewsSearchingStore',
    state: (): searchReviewState => ({
        isLoading: false,
        exercises: [],
        substring: '',
        authorName: '',
        authorAge: '',
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
        getQueryString() {
            const searchParams = new URLSearchParams();
            if(this.substring.length > 0){
                searchParams.append('substring', `${this.substring}`);
            }
            if(this.authorName.length > 0){
                searchParams.append('name', `${this.authorName}`);
            }
            if(this.authorAge.length > 0){
                searchParams.append('age', `${parseInt(this.authorAge)}`);
            }
            if(this.date){
                searchParams.append('date', `${new Date(this.date)}`);
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
