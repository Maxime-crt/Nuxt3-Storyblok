<template>
  <header class="w-full h-24 bg-[#f7f6fd] shadow flex items-center">
    <div
      class="container mx-auto flex items-center justify-between px-4 lg:px-0"
    >
      <NuxtLink :to="localePath('/')">
        <h1 class="text-gray-800 text-3xl font-bold">Mon Blog</h1>
      </NuxtLink>

      <nav>
        <div class="flex items-center space-x-4">
          <select
            v-model="selectedLocale"
            @change="changeLocale"
            class="form-select border-gray-300 rounded-md"
          >
            <option v-for="{ code, name } in locales" :key="code" :value="code">
              {{ name }}
            </option>
          </select>
          <NuxtLink
            :to="localePath('/blog')"
            class="text-gray-600 hover:text-gray-800 transition duration-300 ease-in-out font-medium"
          >
            Blog
          </NuxtLink>
          <NuxtLink
            :to="localePath('/about')"
            class="text-gray-600 hover:text-gray-800 transition duration-300 ease-in-out font-medium"
          >
            À propos de nous
          </NuxtLink>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup>
const localePath = useLocalePath()
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const selectedLocale = ref(locale)

function changeLocale() {
  const path = switchLocalePath(selectedLocale.value)
  navigateTo(path)
}
</script>
