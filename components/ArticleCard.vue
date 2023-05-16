<template>
  <NuxtLink :to="'/' + slug" v-editable="article" class="w-full h-full border rounded-[5px] text-left overflow-hidden">
    <img v-if="article.image" :src="article.image.filename + '/m/600x0'" :alt="article.image.alt"
      class="w-full h-48 xl:h-72 object-cover pointer-events-none" />

    <div class="p-4">
      <h2 class="text-2xl text-[#1d243d] font-bold mb-1">
        {{ article.title }}
      </h2>
      <div class="text-gray-600 mb-3">{{ article.Author }}</div>
      <div class="line-clamp-4">
        {{ article.description }}
      </div>
      <div class="mt-3">
        <span v-for="(tag, index) in article.tag_list" :key="index"
          class="inline-block bg-[#f5f5f5] rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          {{ tag }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
defineProps({ article: Object, slug: String });
</script>
