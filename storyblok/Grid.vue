<template>
    <div v-editable="blok"
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StoryblokComponent
            v-for="blok in blok.columns"
            :key="blok._uid"
            :blok="blok"
        />
    </div>
</template>

<script setup>
defineProps({
  blok: {
    type: Object,
    required: true
  }
})
</script>