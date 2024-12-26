<script setup lang="ts">
import type { Note } from "@/pages/index.vue"
import l from "lodash"
import { useNotesStore } from "@/stores/notes"
import { showSuccessToast, showErrorToast } from "@/utils/toasts"

const route = useRoute()
const router = useRouter()

const showModalToDelete = ref(false)
const showModalToCancel = ref(false)
const isGoodToGoNext = ref(false)
const isStateChanged = ref(false)

const notesStore = useNotesStore()

const isNewNote = computed(() => route.query.id === "new")
const initialNote = ref<Note | null>(null)

watchEffect(() => {
  if (isNewNote.value) {
    initialNote.value = { ...({} as Note), todos: [] }
  } else {
    initialNote.value = notesStore.getNoteById(l.toNumber(route.query.id))
  }
})

function saveNote(note: Note) {
  if (!note) return
  if (isNewNote.value) {
    note.id = getNextId(l.map(notesStore.notes, (note) => note.id))
    notesStore.addNote(note)
    showSuccessToast({ title: "Заметка создана" })
    router.push(`/edit?id=${note.id}`)
  } else {
    notesStore.updateNote(note)
    showSuccessToast({ title: "Заметка сохранена" })
  }
}

function showConfirmDeleteNote() {
  showModalToDelete.value = true
}

function showConfirmIfNeededOrLeave() {
  if (isStateChanged.value) return (showModalToCancel.value = true)
  else return router.push("/")
}

function discardDialogAndApproveToGoToMain() {
  showModalToCancel.value = false
  isGoodToGoNext.value = true
  router.push("/")
}

function discardDialogAndDeleteNoteAndGoToMain() {
  showModalToDelete.value = false
  if (!route.query.id || route.query.id === "new") {
    return showErrorToast({ title: "Ошибка при удалении заметки" })
  }
  notesStore.deleteNoteById(l.toNumber(route.query.id))
  showSuccessToast({ title: "Заметка удалена" })
  isGoodToGoNext.value = true
  router.push("/")
}

onBeforeRouteLeave((to, from, next) => {
  if (isStateChanged.value && !isGoodToGoNext.value) {
    showModalToCancel.value = true
    next(false)
  } else {
    isGoodToGoNext.value = false
    next()
  }
})
</script>

<template>
  <div class="h-full">
    <NoteEditor
      v-if="route?.query?.id && initialNote"
      v-model:is-state-changed="isStateChanged"
      :note="initialNote"
      @save="saveNote"
      @cancel="showConfirmIfNeededOrLeave"
      @delete="showConfirmDeleteNote"
    />

    <div v-if="!route?.query?.id || !initialNote" class="text-center">
      Заметка не найдена
    </div>

    <ConfirmationDialog
      v-model:show-modal="showModalToDelete"
      title="Удаление заметки"
      description="Вы уверены?"
      label-on-button="Удалить"
      @confirm="discardDialogAndDeleteNoteAndGoToMain"
    />

    <ConfirmationDialog
      v-model:show-modal="showModalToCancel"
      title="Сброс редактирования"
      description="Вы уверены, внесенные изменения будут потеряны?"
      label-on-button="Сбросить"
      @confirm="discardDialogAndApproveToGoToMain"
    />
  </div>
</template>
