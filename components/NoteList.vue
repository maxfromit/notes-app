<script setup lang="ts">
import type { Note } from "@/pages/index.vue"
import l from "lodash"

const props = defineProps<{
  notes: Note[]
}>()

const emit = defineEmits<{
  (e: "edit" | "delete", noteId: number): void
  (e: "create"): void
}>()

const toDosToShow = 3
</script>

<template>
  <div class="grid grid-rows-[auto_1fr] gap-2">
    <div class="flex flex-row gap-2 justify-center">
      <div class="text-xl">Заметки</div>
      <UButton
        icon="i-lucide-plus"
        variant="ghost"
        color="primary"
        @click="emit('create')"
      />
    </div>
  </div>
  <div v-if="!l.isEmpty(props.notes)" key="notes-list" class="grid gap-5">
    <div v-for="note in props.notes" :key="note.id">
      <UCard>
        <div class="grid grid-cols-[1fr_auto]">
          <div class="font-medium">{{ note.title }}</div>
          <div class="grid grid-cols-[auto_auto] gap-1 items-start">
            <UTooltip text="Редактировать заметку">
              <UButton
                icon="i-lucide-pencil"
                variant="ghost"
                color="neutral"
                @click="emit('edit', note.id)"
              />
            </UTooltip>

            <UTooltip text="Удалить заметку">
              <UButton
                icon="i-lucide-trash"
                variant="ghost"
                color="neutral"
                @click="emit('delete', note.id)"
              />
            </UTooltip>
          </div>
        </div>
        <div class="text-sm mt-1">
          <div
            v-for="todo in note.todos.slice(0, toDosToShow)"
            :key="todo.id"
            :class="{ 'line-through': todo.done }"
          >
            {{ todo.text }}
          </div>
          <div v-if="l.size(note.todos) > toDosToShow">
            ...еще {{ l.size(note.todos) - toDosToShow }}
          </div>
        </div>
      </UCard>
    </div>
  </div>

  <div v-else key="notes-empty" class="text-center">
    Заметок нет, нажмите +, чтобы создать новую
  </div>
</template>
