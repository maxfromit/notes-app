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

const loading = ref(true)
const showModal = ref(false)
const noteIdToDelete = ref<number | null>(null)

onMounted(() => {
  loadNotes()
  loading.value = false
})

const sortedNotes = computed(() =>
  l.orderBy(
    notes.value.map((note) => ({
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
  deleteNoteById(noteIdToDelete.value)
  showModal.value = false
  noteIdToDelete.value = null
  showSuccessToast({ title: "Заметка удалена" })
}
</script>

<template>
  <div class="h-full">
    <div v-if="loading" class="grid gap-10">
      <div class="grid grid-cols-[1fr_auto]">
        <div class="text-xl">
          <USkeleton class="h-6 w-32" />
        </div>
        <USkeleton class="h-6 w-6" />
      </div>
      <div class="grid gap-5">
        <UCard>
          <div class="grid grid-cols-[1fr_auto]">
            <USkeleton class="h-4 w-48" />
            <div class="grid grid-cols-2 gap-1">
              <USkeleton class="h-3 w-3" />
              <USkeleton class="h-3 w-3" />
            </div>
          </div>
          <div class="text-sm">
            <USkeleton class="h-4 w-2/3" />
            <USkeleton class="h-4 w-2/3" />
            <USkeleton class="h-4 w-1/3" />
          </div>
        </UCard>
      </div>
    </div>
    <NoteList
      v-else
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
