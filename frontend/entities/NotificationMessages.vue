<template>
  <div class="notification">
    <transition-group name="transition-animate">
      <NotificationText
          v-for="notification in notifications"
          :key="notification.id"
          :notification="notification"
          @click="hideNotification(notification.id)"
      />
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import NotificationText from "~/shared/ui/NotificationText.vue";
import {useNotifyStore} from "~/stores/notify";

const store = useNotifyStore()
const notifications = computed(() => store.getNotifications);
const hideNotification = (id: number) => {
  store.hideNotification(id)
};
</script>

<style lang="scss">
.notification {
  flex-direction: column-reverse;
  display: flex;
  position: fixed;
  bottom: 30px;
  right: 16px;
  z-index: 1000;
  width: 100%;
  max-width: 300px;
}

.transition-animate {
  &-enter-from {
    transform: translateX(120px);
    opacity: 0;
  }

  &-enter-active {
    transition: all ease 1s;
  }

  &-enter-to {
    opacity: 1;
  }

  &-leave-from {
    opacity: 1;
  }

  &-leave-active {
    transition: all ease 1s;
  }

  &-leave-to {
    transform: translateX(120px);
    opacity: 0;
  }

  &-move {
    transition: all ease 1s;
  }
}
</style>
