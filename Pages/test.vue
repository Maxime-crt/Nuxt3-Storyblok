<template>
    <div class="py-24">
        <h2 class="text-6xl text-gray-800 font-bold text-center mb-12">
            Articles avec les tags "dépression" et "test"
        </h2>
        <div class="container mx-auto grid md:grid-cols-3 gap-12 my-12 place-items-start">
            <ArticleCard v-for="article in filteredArticles" :key="article.uuid"
                :article="{ ...article.content, tag_list: article.tag_list }" :slug="article.full_slug" />
        </div>
    </div>
</template>
  
<script setup>

const articles = ref(null);
const storyblokApi = useStoryblokApi();
const { data } = await storyblokApi.get('cdn/stories', {
    version: 'draft',
    starts_with: 'blog',
    is_startpage: false,
});
articles.value = data.stories;

const filteredArticles = computed(() => {
    return articles.value.filter((article) => {
        if (!article.tag_list) {
            console.error('Tags not found for article:', article);
            return false;
        }

        const requiredTags = ['dépression', 'test'];
        /* L'article possède l'ensemble des tags */
        /* return requiredTags.every((tag) => article.tag_list.includes(tag)); */

        /* L'article possède au moins un des tags */
        return requiredTags.some((tag) => article.tag_list.includes(tag));
    });
});
</script>
  