import type { Note } from "../pages/index.vue"
import l from "lodash"

export const useNotes = () => {
  const notes = ref<Note[]>([])

  const loadNotes = () => {
    const storedNotes = localStorage.getItem("notes")
    notes.value = storedNotes ? JSON.parse(storedNotes) : []
  }

  const saveNotes = (newNotes: Note[]) => {
    notes.value = newNotes
    localStorage.setItem("notes", JSON.stringify(newNotes))
  }

  const getNoteById = (id: number) => {
    return notes.value.find((note) => note.id === id) || null
  }

  const addNote = (newNote: Note) => {
    notes.value.push(newNote)
    saveNotes(notes.value)
  }

  const updateNote = (updatedNote: Note) => {
    const existingNoteIndex = l.findIndex(notes.value, { id: updatedNote.id })
    if (existingNoteIndex !== -1) {
      notes.value[existingNoteIndex] = updatedNote
      saveNotes(notes.value)
    }
  }

  const deleteNoteById = (id: number) => {
    notes.value = notes.value.filter((note) => note.id !== id)
    saveNotes(notes.value)
  }

  return {
    notes,
    loadNotes,
    saveNotes,
    addNote,
    updateNote,
    getNoteById,
    deleteNoteById,
  }
}
