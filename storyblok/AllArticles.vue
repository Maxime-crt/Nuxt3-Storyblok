<template>
  <div class="py-8">
    <h2 class="text-3xl text-gray-800 font-bold text-center">
      {{ blok.headline }}
    </h2>
    <div class="flex flex-row flex-wrap justify-center gap-3 rounded mt-6 mb-6">
      <div
        v-for="tag in tagList"
        :key="tag"
        class="p-2 rounded-lg bg-gray-100 hover:bg-yellow-200 cursor-pointer select-none"
        :class="{ 'bg-yellow-200': selectedTag === tag }"
        @click="selectedTag = selectedTag === tag ? '' : tag"
      >
        <p>{{ tag }}</p>
      </div>
    </div>
    <div
      class="container mx-auto grid md:grid-cols-3 gap-12 my-12 place-items-start"
    >
      <ArticleCard
        v-for="article in paginatedArticles"
        :key="article.uuid"
        :article="{ ...article.content, tag_list: article.tag_list }"
        :slug="article.full_slug"
      />
    </div>
    <div class="text-center mt-8">
      <button 
        v-if="showLoadMoreButton"
        @click="loadMoreArticles"
        class="bg-gray-100 hover:bg-yellow-200  font-bold py-2 px-4 rounded"
      >
        Voir plus <i class="fas fa-arrow-down"></i> <!-- Là faut que tu changes par la librarie que tu souhaites -->
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({ blok: Object })

const articles = ref(null)
const selectedTag = ref('')
let numberOfArticlesToShow = ref(3)
const storyblokApi = useStoryblokApi()

const { data } = await storyblokApi.get('cdn/stories', {
  version: 'draft',
  starts_with: 'blog',
  is_startpage: false,
})

articles.value = data.stories

const tagList = computed(() => {
  let tags = []
  articles.value.forEach((article) => {
    article.tag_list.forEach((tag) => {
      if (!tags.includes(tag)) {
        tags.push(tag)
      }
    })
  })
  return tags
})

const taggedArticles = computed(() => {
  if (!selectedTag.value) return []

  return articles.value.filter((article) => {
    return article.tag_list.includes(selectedTag.value)
  })
})

const finalFilteredArticles = computed(() => {
  if (selectedTag.value) {
    return taggedArticles.value
  }
  return articles.value
})

const paginatedArticles = computed(() => {
  return finalFilteredArticles.value.slice(0, numberOfArticlesToShow.value)
})

const showLoadMoreButton = computed(() => {
  return finalFilteredArticles.value.length > numberOfArticlesToShow.value
})

const loadMoreArticles = () => {
  numberOfArticlesToShow.value += 3
}
</script>
