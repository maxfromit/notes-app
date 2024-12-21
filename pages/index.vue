<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import NoteList from "@/components/NoteList.vue"
import l from "lodash"

export type Note = {
  id: number
  title: string
  todos: { id: number; text: string; done: boolean }[]
}

const initialNotes = [
  {
    id: 1,
    title: "Первая заметка",
    todos: [
      { id: 1, text: "Первое дело", done: false },
      { id: 2, text: "Второе дело", done: true },
    ],
  },
  {
    id: 2,
    title: "Вторая заметка",
    todos: [
      { id: 1, text: "Еще одно дело", done: false },
      { id: 2, text: "Еще одно дело", done: false },
    ],
  },
  {
    id: 3,
    title: "Третья заметка",
    todos: [
      { id: 1, text: "Дело 1", done: true },
      { id: 2, text: "Дело 2", done: false },
      { id: 3, text: "Дело 3", done: true },
      { id: 4, text: "Дело 4", done: false },
    ],
  },
]

const notes = ref<Note[]>(initialNotes)

const sortedNotes = computed(() =>
  notes.value.map((note) => ({
    ...note,
    todos: l.orderBy(note.todos, ["done"], ["desc"]),
  }))
)

const router = useRouter()

function createNote() {
  router.push("/edit?id=new")
}

function editNote(noteId: number) {
  router.push(`/edit?id=${noteId}`)
}

function deleteNote(noteId: number) {
  notes.value = l.reject(notes.value, { id: noteId })
}
</script>

<template>
  <NoteList
    :notes="sortedNotes"
    @edit="editNote"
    @delete="deleteNote"
    @create="createNote"
  />
</template>
