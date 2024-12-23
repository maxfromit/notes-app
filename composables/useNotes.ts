import type { Note } from "../pages/index.vue"
import l from "lodash"

export const useNotes = () => {
  const notesInMemory = ref<Note[]>([])

  const loadNotes = () => {
    const storedNotes = localStorage.getItem("notes")
    notesInMemory.value = storedNotes ? JSON.parse(storedNotes) : []
  }

  const saveNotes = (notes: Note[]) => {
    notesInMemory.value = notes
    localStorage.setItem("notes", JSON.stringify(notes))
  }

  const getNoteById = (id: number) => {
    return notesInMemory.value.find((note) => note.id === id) || null
  }

  const addNote = (newNote: Note) => {
    notesInMemory.value.push(newNote)
    saveNotes(notesInMemory.value)
  }

  const updateNote = (updatedNote: Note) => {
    const existingNoteIndex = l.findIndex(notesInMemory.value, {
      id: updatedNote.id,
    })
    if (existingNoteIndex !== -1) {
      notesInMemory.value[existingNoteIndex] = updatedNote
      saveNotes(notesInMemory.value)
    }
  }

  const deleteNoteById = (id: number) => {
    notesInMemory.value = notesInMemory.value.filter((note) => note.id !== id)
    saveNotes(notesInMemory.value)
  }

  return {
    notes: notesInMemory,
    loadNotes,
    saveNotes,
    addNote,
    updateNote,
    getNoteById,
    deleteNoteById,
  }
}
