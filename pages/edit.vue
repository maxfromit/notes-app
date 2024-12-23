<script setup lang="ts">
import type { Note } from "../pages/index.vue"
import l from "lodash"

const route = useRoute()
const router = useRouter()

function saveNote() {
  // Save note logic
  router.push("/")
}

function cancelEdit() {
  router.push("/")
}

function deleteNote() {
  router.push("/")
}
</script>

<template>
  <div class="h-full">
    <NoteEditor
      v-if="route?.query?.id"
      :note-id="route?.query?.id"
      @save="saveNote"
      @cancel="cancelEdit"
      @delete="deleteNote"
    />
  </div>
</template>
