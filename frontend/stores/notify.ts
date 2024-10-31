export type Notification = {
    message: string;
    type: string;
    id: number;
    timerId?: NodeJS.Timeout;
};
type INotification = {
    notifications: Notification[];
};
export const useNotifyStore = defineStore({
    id: 'notifyStore',
    state: (): {notifications: Notification[]} => ({
        notifications: [],
    }),
    actions: {
        removeNotification(idx: number) {
            this.notifications.splice(idx, 1);
        },
        addNotification(
            notification: Notification
        ) {
            const timerId = setTimeout(() => {
               this.hideNotification(notification.id);
            }, 3000);
            this.notifications.push({...notification, timerId});
        },
        hideNotification(
            id: number
        ) {
            const index = this.notifications.findIndex(entry => entry.id === id);
            if (index !== -1) {
                clearTimeout(this.notifications[index].timerId);
                this.removeNotification(index)
            }
        },
    },
    getters: {
        getNotifications: (state: INotification) => state.notifications,
    },
});
