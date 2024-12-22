<script setup lang="ts">
const props = defineProps<{
  title: string
  description: string
  labelOnButton: string
}>()

const showModal = defineModel<boolean>("showModal", {
  default: false,
})

const emit = defineEmits<{
  (e: "confirm"): void
}>()
</script>

<template>
  <UModal
    v-model:open="showModal"
    :title="props.title"
    :close="{ icon: 'i-lucide-x' }"
    :description="props.description"
    :ui="{ footer: 'justify-end' }"
    @close="showModal = false"
  >
    <template #footer>
      <UButton
        label="Отмена"
        color="neutral"
        variant="outline"
        @click="showModal = false"
      />
      <UButton
        :label="props.labelOnButton"
        color="primary"
        @click="emit('confirm')"
      />
    </template>
  </UModal>
</template>
