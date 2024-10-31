<script setup lang="ts">
import { defineProps } from 'vue';
import type { Notification } from '~/stores/notify';
import ErrorNotifyIcon from "~/shared/icons/ErrorNotifyIcon.vue";
import SuccessNotifyIcon from "~/shared/icons/SuccessNotifyIcon.vue";

defineProps<{
  notification: Notification;
}>();

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'error':
      return 'Ошибка';
    case 'success':
      return 'Успешно';
    default:
      return type;
  }
};
</script>

<template>
  <div
      class="content_text"
      :class="notification.type === 'error' ? 'error' : 'success'"
  >
    <div class="icon">
      <ErrorNotifyIcon v-if="notification.type === 'error'" viewBox="0 0 24 24" />
      <SuccessNotifyIcon
          v-if="notification.type === 'success'"
          viewBox="0 0 24 24"
      />
    </div>
    <div class="content_text-desc">
      <span>{{ getTypeLabel(notification.type) }}</span>
      <span>{{ notification.message }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.icon {
  display: flex;
  align-items: baseline;
  justify-content: center;
}

.content_text {
  display: flex;
  column-gap: 16px;
  padding: 10px 20px;
  color: #ffffff;
  align-items: center;
  z-index: 1000;
  margin-bottom: 16px;
  box-shadow: 0 5px 20px rgba(111, 117, 135, 0.15);
  background: #ffffff;
  border-radius: 10px;
  &.error {
    border-bottom: 2px solid red;
  }

  &.success {
    border-bottom: 2px solid green;
  }

  span {
    color: #525252;
  }

  &-desc {
    display: flex;
    flex-direction: column;

    span:first-child {
      font-weight: 600;
    }

    span:last-child {
      font-size: 15px;
    }
  }
}
</style>
