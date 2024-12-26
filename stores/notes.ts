import { defineStore } from "pinia"
import { useStorage } from "@vueuse/core"
import type { Note } from "@/pages/index.vue"

export const useNotesStore = defineStore("notes", {
  state: () => ({
    notes: useStorage<Note[]>("notes", []),
  }),
  actions: {
    getNoteById(id: number) {
      return this.notes.find((note) => note.id === id) || null
    },
    addNote(newNote: Note) {
      this.notes.push(newNote)
    },
    updateNote(updatedNote: Note) {
      const existingNoteIndex = this.notes.findIndex(
        (note) => note.id === updatedNote.id
      )
      if (existingNoteIndex !== -1) {
        this.notes[existingNoteIndex] = updatedNote
      }
    },
    deleteNoteById(id: number) {
      this.notes = this.notes.filter((note) => note.id !== id)
    },
  },
  persist: true,
})
