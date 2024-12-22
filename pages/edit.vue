<script setup lang="ts">
import type { Note } from "../pages/index.vue"
import l from "lodash"

const route = useRoute()
const router = useRouter()

const note = ref<Note | null>({
  id: 1,
  title: "Первая заметка",
  todos: [
    { id: 1, text: "Первое дело", done: false },
    { id: 2, text: "Второе дело", done: true },
  ],
})

console.log("route.query.id", route?.query?.id)

function saveNote() {
  // Save note logic
  router.push("/")
}

function cancelEdit() {
  router.push("/")
}

function deleteNote() {
  note.value = null
  router.push("/")
}
</script>

<template>
  <div class="h-full">
    <NoteEditor
      v-if="note"
      :note="note"
      @save="saveNote"
      @cancel="cancelEdit"
      @delete="deleteNote"
    />
  </div>
</template>
