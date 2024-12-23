<script setup lang="ts">
import { ref, computed, watchEffect } from "vue"
import type { Note } from "../pages/index.vue"
import type { FormError } from "#ui/types"
import l from "lodash"
import ConfirmationDialog from "./ConfirmationDialog.vue"
import { getNextId } from "@/utils/getNextId"

const props = defineProps<{
  note: Note | null
}>()

const emit = defineEmits<{
  (e: "delete" | "cancel"): void
  (e: "save", note: Note): void
}>()

const noteClone = ref(l.cloneDeep(props.note))
const draftState = ref<Note | null>(null)
const newToDo = ref("")

const showModalToDelete = ref(false)
const showModalToCancel = ref(false)

watchEffect(() => {
  noteClone.value = l.cloneDeep(props.note)
})

function resetToInitialState() {
  draftState.value = l.cloneDeep(noteClone.value)
  noteClone.value = l.cloneDeep(props.note)
}

function returnToNewState() {
  noteClone.value = l.cloneDeep(draftState.value)
  draftState.value = null
}

function removeTodo(todoId: number) {
  if (!noteClone.value) return
  noteClone.value.todos = noteClone.value.todos.filter(
    (todo) => todo.id !== todoId
  )
}

function addNewToDo() {
  if (!noteClone.value) return
  if (newToDo.value) {
    noteClone.value.todos.push({
      id: getNextId(l.map(noteClone.value.todos, (todo) => todo.id)),
      text: newToDo.value,
      done: false,
    })
    newToDo.value = ""
  }
}

function saveNote() {
  if (!noteClone.value) return
  emit("save", noteClone.value)
}

function confirmDelete() {
  showModalToDelete.value = true
}

function confirmCancel() {
  showModalToCancel.value = true
}

function deleteNote() {
  emit("delete")
  showModalToDelete.value = false
}

function cancelEditNote() {
  emit("cancel")
  showModalToCancel.value = false
}

const isStateChanged = computed(() => !l.isEqual(noteClone.value, props.note))
</script>

<template>
  <div class="grid grid-rows-[auto_1fr_auto] gap-5 h-full">
    <div class="text-xl">Редактор заметки</div>

    <div>
      <div v-if="noteClone" class="grid gap-5">
        <div class="grid grid-rows-auto">
          <div class="grid grid-cols-[1fr_auto] items-center gap-2">
            <UFormField name="title">
              <UInput
                v-model="noteClone.title"
                placeholder="Заголовок"
                type="title"
                size="xl"
                variant="ghost"
              />
            </UFormField>
            <div>
              <UButton
                icon="i-lucide-save"
                variant="ghost"
                color="neutral"
                :disabled="!isStateChanged || !noteClone.title.trim()"
                @click="saveNote"
              />
              <UButton
                icon="i-lucide-rotate-ccw"
                variant="ghost"
                color="neutral"
                :disabled="!isStateChanged"
                @click="confirmCancel"
              />
              <UButton
                icon="i-lucide-trash"
                variant="ghost"
                color="neutral"
                :disabled="!noteClone.id"
                @click="confirmDelete"
              />
            </div>
          </div>
          <div class="flex flex-row items-center gap-1 pl-3">
            <UButton
              icon="i-lucide-undo"
              variant="ghost"
              color="neutral"
              size="xs"
              :disabled="!isStateChanged"
              @click="resetToInitialState"
            />
            <UButton
              icon="i-lucide-redo"
              variant="ghost"
              color="neutral"
              size="xs"
              :disabled="!draftState"
              @click="returnToNewState"
            />
          </div>
        </div>

        <div
          v-if="
            !l.chain(noteClone.todos).filter({ done: false }).isEmpty().value()
          "
          class="grid gap-2"
        >
          <div
            v-for="todo in l.filter(noteClone.todos, { done: false })"
            :key="todo.id"
          >
            <UCard>
              <div class="grid grid-cols-[auto_1fr] items-center gap-2">
                <UFormField name="todoDone">
                  <UCheckbox v-model="todo.done" />
                </UFormField>
                <UFormField name="todoText">
                  <div class="grid grid-cols-[1fr_auto] gap-2 items-center">
                    <UInput
                      v-model="todo.text"
                      placeholder="To-do"
                      type="text"
                      size="sm"
                      variant="ghost"
                    />

                    <UButton
                      icon="i-lucide-circle-x"
                      variant="ghost"
                      color="neutral"
                      size="sm"
                      @click="removeTodo(todo.id)"
                    />
                  </div>
                </UFormField>
              </div>
            </UCard>
          </div>
        </div>

        <div
          v-if="
            !l.chain(noteClone.todos).filter({ done: true }).isEmpty().value()
          "
          class="grid gap-2"
        >
          <div class="text-sm">Выполнено:</div>
          <div
            v-for="todo in l.filter(noteClone.todos, { done: true })"
            :key="todo.id"
          >
            <UCard>
              <div class="grid grid-cols-[auto_1fr] items-center gap-2">
                <UFormField name="todoDone">
                  <UCheckbox v-model="todo.done" />
                </UFormField>
                <UFormField name="todoText">
                  <div class="grid grid-cols-[1fr_auto] gap-2 items-center">
                    <UInput
                      v-model="todo.text"
                      placeholder="To-do"
                      type="text"
                      size="sm"
                      variant="ghost"
                    />

                    <UButton
                      icon="i-lucide-circle-x"
                      variant="ghost"
                      color="neutral"
                      size="sm"
                      @click="removeTodo(todo.id)"
                    />
                  </div>
                </UFormField>
              </div>
            </UCard>
          </div>
        </div>
      </div>
    </div>
    <UCard>
      <div class="grid grid-cols-[auto_1fr] gap-2 items-center">
        <UButton
          icon="i-lucide-plus"
          variant="ghost"
          color="neutral"
          size="sm"
          :disabled="l.isEmpty(newToDo.trim())"
          @click="addNewToDo"
        />
        <UInput
          v-model="newToDo"
          placeholder="Добавить задачу"
          type="text"
          size="sm"
          variant="ghost"
        />
      </div>
    </UCard>
    <ConfirmationDialog
      v-model:show-modal="showModalToDelete"
      title="Удаление заметки"
      description="Вы уверены?"
      label-on-button="Удалить"
      @confirm="deleteNote"
    />

    <ConfirmationDialog
      v-model:show-modal="showModalToCancel"
      title="Сброс редактирования"
      description="Вы уверены, внесенные изменения будут потеряны?"
      label-on-button="Сбросить"
      @confirm="cancelEditNote"
    />
  </div>
</template>

<style scoped>
.input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
}
</style>
