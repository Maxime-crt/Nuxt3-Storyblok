<template>
  <div v-editable="blok">
    <img :src="blok.image.filename + '/m/1600x0'" :alt="blok.image.alt" class="mx-auto w-3/4 object-cover" />
    <div class="container mx-auto mb-12">
      <h1 class="text-6xl text-gray-800 font-bold mt-12 mb-4">
        {{ blok.title }}
      </h1>
      <h2 class="text-2xl text-gray-500 font-bold mb-4">
        {{ blok.description }}
      </h2>
      <div class="text-gray-600 mb-3">
        Written by: <b>{{ blok.Author }}</b>
      </div>
      <div v-html="resolvedRichText"></div>
      <div v-html="youtubeLinks"></div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ blok: Object });

const resolvedRichText = computed(() => renderRichText(props.blok.content));

function getYoutubeLinks(content) {
  let youtubeLinks = '';
  content.forEach(item => {
    if (item.type === 'blok' && item.attrs.body) {
      item.attrs.body.forEach(blokItem => {
        if (blokItem.Video && blokItem.component === 'Youtube') {
          const videoId = blokItem.Video.split('v=')[1];
          const embedUrl = `https://www.youtube.com/embed/${videoId}`;
          youtubeLinks += `<div class="video-container"><iframe width="560" height="315" src="${embedUrl}" frameborder="0" allowfullscreen></iframe></div>`;
        }
      });
    }
  });
  return youtubeLinks;
}

const youtubeLinks = getYoutubeLinks(props.blok.content.content);
</script>
