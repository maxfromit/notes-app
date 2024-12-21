<script setup lang="ts">
import { ref } from "vue"
import type { Note } from "../pages/index.vue"
import l from "lodash"

const props = defineProps<{
  notes: Note[]
}>()

const emit = defineEmits<{
  (e: "edit" | "delete", noteId: number): void
}>()

const showModal = ref(false)
const noteToDelete = ref<number | null>(null)
const toDosToShow = 3

function confirmDelete(noteId: number) {
  noteToDelete.value = noteId
  showModal.value = true
}

function deleteNote() {
  if (noteToDelete.value !== null) {
    emit("delete", noteToDelete.value)
    noteToDelete.value = null
    showModal.value = false
  }
}
</script>

<template>
  <div class="grid grid-rows-[auto_1fr] gap-10">
    <div class="grid grid-cols-[1fr_auto]">
      <div class="text-xl">Заметки</div>
      <UButton icon="i-lucide-plus" color="primary" />
    </div>
  </div>
  <div v-if="!l.isEmpty(props.notes)" key="notes-list" class="grid gap-5">
    <div v-for="note in props.notes" :key="note.id">
      <div class="grid grid-cols-[1fr_auto]">
        <div>{{ note.title }}</div>
        <div class="grid grid-cols-2 gap-1">
          <UButton
            icon="i-lucide-pencil"
            variant="outline"
            color="neutral"
            @click="emit('edit', note.id)"
          />
          <UButton
            icon="i-lucide-trash"
            variant="outline"
            color="neutral"
            @click="confirmDelete(note.id)"
          />
        </div>
      </div>
      <ul class="text-sm">
        <li
          v-for="todo in note.todos.slice(0, toDosToShow)"
          :key="todo.id"
          :class="{ 'line-through': !todo.done }"
        >
          {{ todo.text }}
        </li>
        <li v-if="l.size(note.todos) > toDosToShow">
          ...еще {{ l.size(note.todos) - toDosToShow }}
        </li>
      </ul>
    </div>
  </div>

  <div v-else key="notes-empty" class="text-center">
    Заметок нет, нажмите +, чтоб создать новую
  </div>

  <UModal
    v-model:open="showModal"
    title="Удаление заметки"
    :close="{
      icon: 'i-lucide-x',
    }"
    description="Вы уверены?"
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
      <UButton label="Удалить" color="primary" @click="deleteNote" />
    </template>
  </UModal>
</template>
