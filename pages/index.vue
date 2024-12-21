<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import NoteList from "@/components/NoteList.vue"

type Note = {
  id: number
  title: string
  todos: { id: number; text: string; done: boolean }[]
}

const notes = ref<Note[]>([
  {
    id: 1,
    title: "First Note",
    todos: [
      { id: 1, text: "First todo", done: false },
      { id: 2, text: "Second todo", done: true },
    ],
  },
  {
    id: 2,
    title: "Second Note",
    todos: [
      { id: 1, text: "Another todo", done: false },
      { id: 2, text: "Yet another todo", done: false },
    ],
  },
])

const router = useRouter()

function createNote() {
  router.push("/edit")
}

function editNote(noteId) {
  router.push(`/edit?id=${noteId}`)
}

function deleteNote(noteId) {
  if (confirm("Are you sure you want to delete this note?")) {
    notes.value = notes.value.filter((note) => note.id !== noteId)
  }
}
</script>

<template>
  <div
    class="-flex -flex-col -grow -justify-center -content-center grid grid-cols-12 h-dvh"
  >
    <UCard
      class="-grow md:col-start-3 lg:col-start-4 col-span-12 md:col-span-8 lg:col-span-6 grid grid-rows-[auto_1fr_auto]"
    >
      <template #header>
        <div class="text-center text-2xl">Ваши заметки</div>
      </template>

      <NoteList :notes="notes" @edit="editNote" @delete="deleteNote" />

      <template #footer>
        <div class="text-end">2024</div>
      </template>
    </UCard>
  </div>
</template>
