<template>
  <div class="py-24">
    <h2 class="text-6xl text-gray-800 font-bold text-center mb-12">
      {{ blok.headline }}
    </h2>
    <div class="text-center mb-8">
      <input
        type="text"
        v-model="searchTerm"
        class="border rounded px-4 py-2 mr-4"
        placeholder="Rechercher un article"
      />
      <label>
        <input type="radio" value="author" v-model="filterType" class="mr-2" />
        Auteur
      </label>
      <label class="ml-4">
        <input type="radio" value="tags" v-model="filterType" class="mr-2" />
        Tags
      </label>
    </div>
    <div
      class="container mx-auto grid md:grid-cols-3 gap-12 my-12 place-items-start"
    >
      <ArticleCard
        v-for="article in filteredArticles"
        :key="article.uuid"
        :article="{ ...article.content, tag_list: article.tag_list }"
        :slug="article.full_slug"
      />
    </div>
    <!-- Nouvelle section pour les articles filtrés par tags -->
    <div v-if="tags.length > 0" class="mt-12">
      <h3 class="text-4xl text-gray-800 font-bold text-center mb-8">
        Articles avec les tags "{{ tags.join('", "') }}"
      </h3>
      <div
        class="container mx-auto grid md:grid-cols-3 gap-12 my-12 place-items-start"
      >
        <ArticleCard
          v-for="article in taggedArticles"
          :key="article.uuid"
          :article="{ ...article.content, tag_list: article.tag_list }"
          :slug="article.full_slug"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ blok: Object, tags: { type: Array, default: () => [] } });

const articles = ref(null);
const searchTerm = ref("");
const filterType = ref("author");
const storyblokApi = useStoryblokApi();
const { data } = await storyblokApi.get("cdn/stories", {
  version: "draft",
  starts_with: "blog",
  is_startpage: false,
});
articles.value = data.stories;

const filteredArticles = computed(() => {
  if (!searchTerm.value) return articles.value;

  return articles.value.filter((article) => {
    const content = article.content;

    if (filterType.value === "author") {
      return content.Author
        ? content.Author.toLowerCase().includes(searchTerm.value.toLowerCase())
        : false;
    } else if (filterType.value === "tags") {
      if (!article.tag_list) {
        console.error("Tags not found for article:", article);
        return false;
      }

      const searchLower = searchTerm.value.toLowerCase();

      return article.tag_list.some((tag) => {
        const tagLower = tag.toLowerCase();

        if (tagLower.includes(searchLower)) {
          console.log("Matched tag:", tag, "for article:", article);
          return true;
        }
        return false;
      });
    }

    return false;
  });
});

// Nouvelle propriété calculée pour filtrer les articles en fonction des tags passés en paramètres
const taggedArticles = computed(() => {
  if (tags.length === 0) return [];

  return articles.value.filter((article) => {
    if (!article.tag_list) {
      console.error("Tags not found for article:", article);
      return false;
    }

    return tags.every((tag) =>
      article.tag_list.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
    );
  });
});
</script>
