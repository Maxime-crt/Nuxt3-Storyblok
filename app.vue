<template>
  <div class="flex flex-col min-h-screen">
    <NuxtLayout>
      <Header />

      <div class="flex-grow">
        <NuxtPage />
      </div>

      <footer class="w-full h-24 bg-[#f7f6fd]">
        <div class="container h-full mx-auto flex items-center justify-center">
          <p class="text-grey-800 text-lg font-bold">
            © {{ currentYear }} Mon Blog
          </p>
        </div>
      </footer>
    </NuxtLayout>
  </div>
</template>

<script setup>
const { locale } = useI18n()

const currentYear = new Date().getFullYear()
</script>
