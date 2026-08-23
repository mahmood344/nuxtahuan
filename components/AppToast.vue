<template>
  <Teleport to="body">
    <div
      class="fixed right-5 top-5 z-[999999] flex w-[360px] max-w-[calc(100vw-40px)] flex-col gap-3"
    >
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="flex items-center justify-between gap-4 rounded-xl border bg-white px-4 py-3 shadow-lg"
          :class="{
            'border-green-300 text-green-700':
              toast.type==='success',

            'border-red-300 text-red-700':
              toast.type==='error',

            'border-amber-300 text-amber-700':
              toast.type==='warning',

            'border-blue-300 text-blue-700':
              toast.type==='info'
          }"
        >
          <span class="text-sm font-bold">
            {{toast.message}}
          </span>

          <button
            class="text-xl opacity-50 transition hover:opacity-100"
            @click="remove(toast.id)"
          >
            ×
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const{
  toasts,
  remove
}=useToast()
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active{
  transition:.25s ease;
}

.toast-enter-from{
  opacity:0;
  transform:translateY(-15px);
}

.toast-leave-to{
  opacity:0;
  transform:translateX(-20px);
}
</style>