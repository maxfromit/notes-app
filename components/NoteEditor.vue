<script setup lang="ts">
import type { Note } from "../pages/index.vue"
import l from "lodash"
import ConfirmationDialog from "./ConfirmationDialog.vue"

const props = defineProps<{
  note: Note
}>()

const emit = defineEmits<{
  (e: "delete" | "cancel"): void
}>()

const state = ref(l.cloneDeep(props.note))

const draftState = ref<Note | null>(null)

const newToDo = ref("")

const showModalToDelete = ref(false)
const showModalToCancel = ref(false)

function resetToInitialState() {
  draftState.value = l.cloneDeep(state.value)
  state.value = l.cloneDeep(props.note)
}

function removeTodo(todoId: number) {
  state.value.todos = state.value.todos.filter((todo) => todo.id !== todoId)
}

function getNextTodoId() {
  return state.value.todos.length
    ? Math.max(...state.value.todos.map((todo) => todo.id)) + 1
    : 1
}

function addNewToDo() {
  if (newToDo.value) {
    state.value.todos.push({
      id: getNextTodoId(),
      text: newToDo.value,
      done: false,
    })
    newToDo.value = ""
  }
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

const isStateChanged = computed(() => !l.isEqual(state.value, props.note))
</script>

<template>
  <div class="grid grid-rows-[auto_1fr_auto] gap-5 h-full">
    <div class="text-xl">Редактор заметки</div>

    <div>
      <UForm :model="state">
        <div class="grid gap-5">
          <div class="grid grid-rows-auto">
            <div class="grid grid-cols-[1fr_auto] items-center gap-2">
              <UFormField name="title">
                <UInput
                  v-model="state.title"
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
                  @click="$emit('save')"
                />
                <UButton
                  icon="i-lucide-rotate-ccw"
                  variant="ghost"
                  color="neutral"
                  :disabled="!isStateChanged"
                  @click="confirmCancel()"
                />
                <UButton
                  icon="i-lucide-trash"
                  variant="ghost"
                  color="neutral"
                  @click="confirmDelete()"
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
                @click="resetToInitialState()"
              />
              <UButton
                icon="i-lucide-redo"
                variant="ghost"
                color="neutral"
                size="xs"
                :disabled="!draftState"
                @click="state = l.cloneDeep(draftState)"
              />
            </div>
          </div>

          <div
            v-if="
              !l.chain(state.todos).filter({ done: false }).isEmpty().value()
            "
            class="grid gap-2"
          >
            <div
              v-for="todo in l.filter(state.todos, { done: false })"
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
              !l.chain(state.todos).filter({ done: true }).isEmpty().value()
            "
            class="grid gap-2"
          >
            <div class="text-sm">Выполнено:</div>
            <div
              v-for="todo in l.filter(state.todos, { done: true })"
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
      </UForm>
    </div>
    <UCard>
      <div class="grid grid-cols-[auto_1fr] gap-2 items-center">
        <UButton
          icon="i-lucide-plus"
          variant="ghost"
          color="neutral"
          size="sm"
          :disabled="l.isEmpty(newToDo)"
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
