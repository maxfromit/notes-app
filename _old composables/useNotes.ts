import { useStorage } from "@vueuse/core"
import l from "lodash"
import type { Note } from "../pages/index.vue"

export const useNotes = () => {
  const notesInMemory = useStorage<Note[]>("notes", [])

  const getNoteById = (id: number) => {
    return notesInMemory.value.find((note) => note.id === id) || null
  }

  const addNote = (newNote: Note) => {
    notesInMemory.value.push(newNote)
  }

  const updateNote = (updatedNote: Note) => {
    const existingNoteIndex = l.findIndex(notesInMemory.value, {
      id: updatedNote.id,
    })
    if (existingNoteIndex !== -1) {
      notesInMemory.value[existingNoteIndex] = updatedNote
    }
  }

  const deleteNoteById = (id: number) => {
    notesInMemory.value = notesInMemory.value.filter((note) => note.id !== id)
  }

  return {
    notes: notesInMemory,
    addNote,
    updateNote,
    getNoteById,
    deleteNoteById,
  }
}
