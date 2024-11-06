import { defineStore } from 'pinia';
import type {Review} from '~/types/exercise';
type showReviewState = {
    reviews: Review[];
    isLoading: boolean;
}

export const useReviewStore = defineStore({
    id: 'reviewStore',
    state: (): showReviewState => ({
        isLoading: false,
        reviews: []
    }),
    actions: {
        async getReviews(id: string | string[]) {
            try {
                const url = `http://localhost:8080/exercises/${id}/review`;
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error status: ${response.status}`);
                }
                const responseData = await response.json();
                console.log(responseData);
                this.reviews = responseData;
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }
})