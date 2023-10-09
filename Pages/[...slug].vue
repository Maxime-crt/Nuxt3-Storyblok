<template>
  <StoryblokComponent v-if="story" :blok="story.content" :story="story" />
</template>

<script setup>
const { slug } = useRoute().params;
const story = await useAsyncStoryblok(
  slug && slug.length > 0 ? slug.join("/") : "home",
  { version: "published" }
);

console.log("Story object:", story);
</script>
