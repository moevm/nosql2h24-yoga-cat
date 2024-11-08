import { defineStore } from 'pinia';
import type {Review} from '~/types/exercise';
import {Properties} from "~/types/exercise";
export type resultExercise = {
    id: string;
    title: string;
    reviews: Review[];
};

type searchReviewState = {
    isLoading: boolean;
    exercises: resultExercise[];
    substring: string;
}

export const useReviewsSearchingStore = defineStore({
    id: 'reviewsSearchingStore',
    state: (): searchReviewState => ({
        isLoading: false,
        exercises: [],
        substring: ''
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
                this.exercises = responseData;
            } catch (error) {
                console.error('Error:', error);
            }
        },
        getQueryString() {
            const searchParams = new URLSearchParams();
            searchParams.append('substring', `${this.substring}`);
            return searchParams.toString();
        },
    }
})