<script setup lang="ts">
import type { Note } from "@/pages/index.vue"
import l from "lodash"
import { getNextId } from "@/utils/getNextId"

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
const draftState = ref<Note | null>(null)
const newToDo = ref("")

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

const isStateChanged = computed(() => !l.isEqual(noteClone.value, props.note))

watch(
  () => isStateChanged.value,
  () => (isStateChangedForEmit.value = isStateChanged.value),
  { immediate: true }
)
</script>

<template>
  <div class="grid grid-rows-[auto_1fr_auto] gap-4 h-full">
    <div class="text-xl text-center">Редактор заметки</div>

    <div>
      <div v-if="noteClone" class="grid gap-5">
        <div class="grid grid-rows-auto">
          <div class="grid grid-cols-[1fr_auto] items-center gap-2">
            <UInput
              v-model="noteClone.title"
              placeholder="Заголовок"
              type="title"
              size="xl"
              variant="ghost"
            />
            <div>
              <UTooltip
                :text="
                  !isStateChanged
                    ? 'Нельзя сохранить: нет изменений'
                    : 'Сохранить'
                "
              >
                <UButton
                  icon="i-lucide-save"
                  variant="ghost"
                  color="neutral"
                  :disabled="!isStateChanged || !noteClone.title.trim()"
                  @click="emit('save', noteClone)"
                />
              </UTooltip>

              <UTooltip
                :text="
                  !isStateChanged
                    ? 'Вернуться на главную'
                    : 'Отменить и вернуться на главную'
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
                    ? 'Нельзя удалить: заметка не создана'
                    : 'Удалить заметку и вернуться на главную'
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
                !isStateChanged
                  ? 'Нельзя отменить изменения: изменений нет'
                  : 'Отменить все изменения и вернуться к изначальному состоянию'
              "
            >
              <UButton
                icon="i-lucide-undo"
                variant="ghost"
                color="neutral"
                size="xs"
                :disabled="!isStateChanged"
                @click="resetToInitialState"
              />
            </UTooltip>

            <UTooltip
              :text="
                !draftState
                  ? 'Нельзя вернуть изменения: заметка в изначальном состоянии'
                  : 'Вернуть все изменения'
              "
            >
              <UButton
                icon="i-lucide-redo"
                variant="ghost"
                color="neutral"
                size="xs"
                :disabled="!draftState"
                @click="returnToNewState"
              />
            </UTooltip>
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
          placeholder="Добавить задачу"
          type="text"
          size="sm"
          variant="ghost"
        />
      </div>
    </UCard>
  </div>
</template>
