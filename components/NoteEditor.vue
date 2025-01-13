<script setup lang="ts">
import type { Note } from "@/pages/index.vue"
import l from "lodash"
import { getNextId } from "@/utils/getNextId"
import { useRefHistory } from "@vueuse/core"

const props = defineProps<{
  note: Note | null
}>()

const emit = defineEmits<{
  (e: "delete" | "cancel"): void
  (e: "save", note: Note): void
}>()

const isStateChangedForEmit = defineModel<boolean>("isStateChanged", {
  default: false,
})

const noteClone = ref(l.cloneDeep(props.note))
const noteTitle = ref(props?.note?.title)

const refHistory = useRefHistory(noteClone, { clone: l.cloneDeep, deep: true })

// const { history, undo, redo } = useRefHistory(noteClone, {
//   deep: true,
// })

watch(
  () => refHistory?.source?.value,
  () => {
    noteTitle.value = refHistory.source.value?.title
  },
  { deep: true, immediate: true }
)

// const draftState = ref<Note | null>(null)
const newToDo = ref("")

function removeTodo(todoId: number) {
  if (!noteClone.value) return
  noteClone.value.todos = noteClone.value.todos.filter(
    (todo) => todo.id !== todoId
  )
}

function save() {
  if (!refHistory?.source?.value) return
  return emit("save", refHistory?.source?.value)
}

function addTitleWithDelay() {
  setTimeout(() => {
    if (refHistory.source.value) {
      refHistory.source.value.title = noteTitle.value
    }
  }, 2000)
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

const isChanged = computed(
  () => !l.isEqual(props.note, refHistory.source.value)
)

watch(
  () => isChanged.value,
  () => (isStateChangedForEmit.value = isChanged.value),
  { immediate: true }
)
</script>

<template>
  <div class="grid grid-rows-[auto_1fr_auto] gap-4 h-full">
    <div class="text-xl text-center">To-Do List Editor</div>
    <div>
      <div v-if="noteClone" class="grid gap-5">
        <div class="grid grid-rows-auto">
          <div class="grid grid-cols-[1fr_auto] items-center gap-2">
            <UInput
              v-model="noteTitle"
              placeholder="Title"
              type="title"
              size="xl"
              variant="ghost"
              @update:model-value="addTitleWithDelay"
            />
            <div>
              <UTooltip :text="!isChanged ? 'Cannot save: no changes' : 'Save'">
                <UButton
                  icon="i-lucide-save"
                  variant="ghost"
                  color="neutral"
                  :disabled="!isChanged"
                  @click="save()"
                />
              </UTooltip>

              <UTooltip
                :text="
                  !isChanged ? 'Go back to main' : 'Cancel and go back to main'
                "
              >
                <UButton
                  icon="i-lucide-rotate-ccw"
                  variant="ghost"
                  color="neutral"
                  @click="emit('cancel')"
                />
              </UTooltip>

              <UTooltip
                :text="
                  !noteClone.id
                    ? 'Cannot delete: note not created'
                    : 'Delete note and go back to main'
                "
              >
                <UButton
                  icon="i-lucide-trash"
                  variant="ghost"
                  color="neutral"
                  :disabled="!noteClone.id"
                  @click="emit('delete')"
                />
              </UTooltip>
            </div>
          </div>
          <div class="flex flex-row items-center gap-1 pl-3">
            <UTooltip
              :text="
                !refHistory?.canUndo.value
                  ? 'Cannot undo changes: no changes'
                  : 'Undo all changes and return to initial state'
              "
            >
              <UButton
                icon="i-lucide-undo"
                variant="ghost"
                color="neutral"
                size="xs"
                :disabled="!refHistory?.canUndo.value"
                @click="refHistory.undo()"
              />
              <!-- <UButton
                icon="i-lucide-undo"
                variant="ghost"
                color="neutral"
                size="xs"
                :disabled="!isStateChanged"
                @click="resetToInitialState"
              /> -->
            </UTooltip>

            <UTooltip
              :text="
                !refHistory?.canRedo.value
                  ? 'Cannot redo changes: note in initial state'
                  : 'Redo all changes'
              "
            >
              <UButton
                icon="i-lucide-redo"
                variant="ghost"
                color="neutral"
                size="xs"
                :disabled="!refHistory?.canRedo.value"
                @click="refHistory.redo()"
              />
            </UTooltip>
          </div>
        </div>

        <div
          v-if="
            !l
              .chain(refHistory.source.value.todos)
              .filter({ done: false })
              .isEmpty()
              .value()
          "
          class="grid gap-2"
        >
          <div
            v-for="todo in l.filter(refHistory.source.value.todos, {
              done: false,
            })"
            :key="todo.id"
          >
            <UCard>
              <div class="grid grid-cols-[auto_1fr] items-center gap-2">
                <UCheckbox v-model="todo.done" />
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
              </div>
            </UCard>
          </div>
        </div>

        <div
          v-if="
            !l
              .chain(refHistory.source.value.todos)
              .filter({ done: true })
              .isEmpty()
              .value()
          "
          class="grid gap-2"
        >
          <div class="text-sm">Completed:</div>
          <div
            v-for="todo in l.filter(refHistory.source.value.todos, {
              done: true,
            })"
            :key="todo.id"
          >
            <UCard>
              <div class="grid grid-cols-[auto_1fr] items-center gap-2">
                <UCheckbox v-model="todo.done" />
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
          placeholder="Add a task"
          type="text"
          size="sm"
          variant="ghost"
          @keyup.enter="addNewToDo"
        />
      </div>
    </UCard>
  </div>
</template>
