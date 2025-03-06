<template>
  <transition-group
      name="toast"
      tag="div"
      class="toast-container"
  >
    <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="['toast', `toast-${toast.type}`]"
        @click="removeToast(toast.id)"
    >
      <div class="toast-icon">{{ getIcon(toast.type) }}</div>
      <div class="toast-content">
        <h4>{{ toast.title }}</h4>
        <p>{{ toast.message }}</p>
      </div>
      <div class="toast-close">&times;</div>
    </div>
  </transition-group>
</template>

<script setup>
import { useToast } from '../service/ToastService.js'

const { toasts, removeToast } = useToast()

const getIcon = (type) => {
  switch (type) {
    case 'success': return '✓'
    case 'error': return '✗'
    case 'warning': return '⚠'
    default: return 'ℹ'
  }
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
}

.toast {
  display: flex;
  align-items: center;
  width: 300px;
  margin-bottom: 10px;
  padding: 15px;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0.95;
}

.toast-success { background-color: #4caf50; }
.toast-error { background-color: #f44336; }
.toast-warning { background-color: #ff9800; }
.toast-info { background-color: #2196f3; }

.toast-icon {
  margin-right: 15px;
  font-size: 24px;
}

.toast-content {
  flex-grow: 1;
}

.toast-content h4 {
  margin: 0 0 5px;
  font-size: 16px;
  font-weight: bold;
}

.toast-content p {
  margin: 0;
  font-size: 14px;
}

.toast-close {
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
}

.toast-enter-active, .toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>