<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import NoteList from "@/components/NoteList.vue"
import l from "lodash"
import { useNotes } from "@/composables/useNotes"

export type Note = {
  id: number
  title: string
  todos: { id: number; text: string; done: boolean }[]
}

const { notes, loadNotes, deleteNoteById } = useNotes()

onMounted(() => {
  loadNotes()
})

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
  deleteNoteById(noteId)
}
</script>

<template>
  {{ notes }}
  <NoteList
    :notes="sortedNotes"
    @edit="editNote"
    @delete="deleteNote"
    @create="createNote"
  />
</template>
