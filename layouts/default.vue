<script setup lang="ts"></script>

<template>
  <div class="grid grid-cols-12 h-dvh">
    <UCard
      class="sm:col-start-3 md:col-start-4 lg:col-start-5 col-span-12 sm:col-span-8 md:col-span-6 lg:col-span-4 grid grid-rows-[auto_1fr_auto] gap-2.5"
    >
      <template #header>
        <HeaderSection />
      </template>

      <slot />

      <template #footer>
        <FooterSection />
      </template>
    </UCard>
  </div>
</template>

<style>
@import "tailwindcss";
@import "@nuxt/ui";
</style>
