<script setup lang="ts">
import type { Note } from "@/pages/index.vue"
import l from "lodash"
import { useNotes } from "@/composables/useNotes"
import { showSuccessToast, showErrorToast } from "@/utils/toasts"

const route = useRoute()
const router = useRouter()

const showModalToDelete = ref(false)
const showModalToCancel = ref(false)
const isGoodToGoNext = ref(false)
const isStateChanged = ref(false)
const nextPath = ref<string | null>(null)

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
  router.push("/edit?id=new")
}

function discardDialogAndDeleteNoteAndGoToMain() {
  showModalToDelete.value = false
  if (!route.query.id || route.query.id === "new") {
    return showErrorToast({ title: "Ошибка при удалении заметки" })
  }
  deleteNoteById(l.toNumber(route.query.id))
  showSuccessToast({ title: "Заметка удалена" })
  isGoodToGoNext.value = true
  router.push("/")
}

onBeforeRouteLeave((to, from, next) => {
  if (isStateChanged.value && !isGoodToGoNext.value) {
    nextPath.value = to.fullPath
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
      v-model:is-state-changed="isStateChanged"
      :note="initialNote"
      @save="saveNote"
      @cancel="showConfirmIfNeededOrLeave"
      @delete="showConfirmDeleteNote"
    />
    <div v-else class="text-center">Заметка не найдена</div>

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
