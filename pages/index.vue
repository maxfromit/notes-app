<script setup lang="ts">
import { useRouter } from "vue-router"
import NoteList from "@/components/NoteList.vue"
import l from "lodash"
import { useNotesStore } from "@/stores/notes"

export type Note = {
  id: number
  title: string
  todos: { id: number; text: string; done: boolean }[]
}

const notesStore = useNotesStore()

const showModal = ref(false)
const noteIdToDelete = ref<number | null>(null)

const sortedNotes = computed(() =>
  l.orderBy(
    notesStore.notes.map((note) => ({
      ...note,
      todos: l.orderBy(note.todos, "done"),
    })),
    "id",
    "desc"
  )
)

const router = useRouter()

function createNote() {
  router.push("/edit?id=new")
}

function editNote(noteId: number) {
  router.push(`/edit?id=${noteId}`)
}

function showConfirmDeleteNote(noteId: number) {
  noteIdToDelete.value = noteId
  showModal.value = true
}

function deleteNote() {
  if (!noteIdToDelete.value) return
  notesStore.deleteNoteById(noteIdToDelete.value)
  showModal.value = false
  noteIdToDelete.value = null
  showSuccessToast({ title: "Заметка удалена" })
}
</script>

<template>
  <div class="h-full">
    <NoteList
      :notes="sortedNotes"
      @edit="editNote"
      @delete="showConfirmDeleteNote"
      @create="createNote"
    />
    <ConfirmationDialog
      v-model:show-modal="showModal"
      title="Удаление заметки"
      label-on-button="Удалить"
      description="Вы уверены?"
      @confirm="deleteNote"
    />
  </div>
</template>
