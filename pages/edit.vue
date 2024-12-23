<script setup lang="ts">
import type { Note } from "../pages/index.vue"
import l from "lodash"
import { useNotes } from "@/composables/useNotes"
import { showSuccessToast, showErrorToast } from "@/utils/toasts"

const route = useRoute()
const router = useRouter()

const { loadNotes, addNote, notes, getNoteById, updateNote, deleteNoteById } =
  useNotes()

const isNewNote = computed(() => route.query.id === "new")
const initialNote = ref<Note | null>(null)
const loading = ref(true)

onMounted(() => {
  loadNotes()
  loading.value = false
})

watchEffect(() => {
  if (isNewNote.value) {
    initialNote.value = { ...({} as Note), todos: [] }
  } else {
    initialNote.value = getNoteById(l.toNumber(route.query.id))
  }
})

function saveNote(note: Note) {
  if (!note) return
  if (isNewNote.value) {
    note.id = getNextId(l.map(notes.value, (note) => note.id))
    addNote(note)
    showSuccessToast({ title: "Заметка создана" })
    router.push(`/edit?id=${note.id}`)
  } else {
    updateNote(note)
    showSuccessToast({ title: "Заметка сохранена" })
  }
}

function cancelEdit() {
  router.push("/")
}

function deleteNote() {
  if (!initialNote.value || !initialNote.value.id) {
    return showErrorToast({ title: "Ошибка при удалении заметки" })
  }
  deleteNoteById(initialNote.value.id)
  showSuccessToast({ title: "Заметка удалена" })
  router.push("/")
}
</script>

<template>
  <div class="h-full">
    <div v-if="loading" class="grid grid-rows-[auto_1fr_auto] gap-5 h-full">
      <div class="text-xl">
        <USkeleton class="h-6 w-32" />
      </div>
      <div>
        <UCard>
          <div class="grid grid-cols-[1fr_auto] items-center gap-2">
            <USkeleton class="h-6 w-full" />
            <div class="grid grid-cols-3 gap-2">
              <USkeleton class="h-6 w-6" />
              <USkeleton class="h-6 w-6" />
              <USkeleton class="h-6 w-6" />
            </div>
          </div>
          <div class="grid gap-2 mt-5">
            <UCard v-for="n in 3" :key="n">
              <div class="grid grid-cols-[auto_1fr] items-center gap-2">
                <USkeleton class="h-6 w-6" />
                <USkeleton class="h-6 w-full" />
              </div>
            </UCard>
          </div>
        </UCard>
      </div>
      <UCard>
        <div class="grid grid-cols-[auto_1fr] gap-2 items-center">
          <USkeleton class="h-6 w-6" />
          <USkeleton class="h-6 w-full" />
        </div>
      </UCard>
    </div>
    <NoteEditor
      v-else-if="route?.query?.id && initialNote"
      :note="initialNote"
      @save="saveNote"
      @cancel="cancelEdit"
      @delete="deleteNote"
    />
    <div v-else class="text-center">Заметка не найдена</div>
  </div>
</template>
