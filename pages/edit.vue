<script setup lang="ts">
import type { Note } from "../pages/index.vue"

const route = useRoute()
const router = useRouter()

const note = ref<Note>({})

console.log("route.query.id", route?.query?.id)

function saveNote() {
  // Save note logic
  router.push("/")
}

function cancelEdit() {
  if (confirm("Are you sure you want to cancel editing?")) {
    router.push("/")
  }
}
</script>

<template>
  <div>
    <NoteEditor :note="note" @save="saveNote" @cancel="cancelEdit" />
  </div>
</template>
