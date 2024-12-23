<script setup lang="ts">
import { useRouter, useRoute } from "vue-router"

const router = useRouter()
const route = useRoute()

function goBack() {
  router.back()
}
</script>

<template>
  <div class="grid grid-cols-[40px_1fr_40px] items-center content-center">
    <div v-if="route.path !== '/'">
      <UButton icon="i-lucide-arrow-left" variant="ghost" @click="goBack" />
    </div>
    <ULink class="text-center text-3xl col-start-2" to="/">Ваши заметки</ULink>
  </div>
</template>
