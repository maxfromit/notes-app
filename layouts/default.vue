<script setup lang="ts">
import { useRouter, useRoute } from "vue-router"

const router = useRouter()
const route = useRoute()

function goBack() {
  router.back()
}
</script>

<template>
  <div class="grid grid-cols-12 h-dvh">
    <UCard
      class="sm:col-start-3 md:col-start-4 lg:col-start-5 col-span-12 sm:col-span-8 md:col-span-6 lg:col-span-4 grid grid-rows-[auto_1fr_auto]"
    >
      <template #header>
        <div class="grid grid-cols-[40px_1fr_40px] items-center content-center">
          <div v-if="route.path !== '/'">
            <UButton
              icon="i-lucide-arrow-left"
              variant="ghost"
              @click="goBack"
            />
          </div>
          <div class="text-center text-3xl col-start-2">Ваши заметки</div>
        </div>
      </template>

      <slot />

      <template #footer>
        <div class="text-end">2024</div>
      </template>
    </UCard>
  </div>
</template>

<style>
@import "tailwindcss";
@import "@nuxt/ui";
</style>
