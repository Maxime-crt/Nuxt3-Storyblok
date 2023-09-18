<template>
  <div v-editable="blok">
    <img
      v-if="blok.image"
      :src="blok.image.filename + '/m/1600x0'"
      :alt="blok.image.alt"
      class="mx-auto w-3/4 object-cover"
    />
    <div class="container mx-auto mb-12">
      <h1 class="text-6xl text-gray-800 font-bold mt-12 mb-4">
        {{ blok.title }}
      </h1>
      <h2 class="text-2xl text-gray-500 font-bold mb-4">
        {{ blok.description }}
      </h2>
      <div class="text-gray-600 mb-3">
        Written by:
        <b>{{ blok.Author }}</b>
      </div>
      <div v-html="resolvedRichText"></div>

      <!-- Section pour afficher les articles associés -->
      <h2 class="text-4xl text-gray-800 font-bold mt-12 mb-4">
        Articles associés
      </h2>
      <div class="grid md:grid-cols-3 gap-12 my-12 place-items-start">
        <ArticleCard
          v-for="article in associatedArticles"
          :key="article.uuid"
          :article="{ ...article.content, tag_list: article.tag_list }"
          :slug="article.full_slug"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ blok: Object, story: Object })

const renderFunctions = {
  blok: renderBlok,
  doc: renderDoc,
  paragraph: renderParagraph,
  heading: renderHeading,
  image: renderImage,
  bullet_list: renderBulletList,
  ordered_list: renderOrderedList,
}

function renderRichText(content) {
  let result = ''
  console.log('content:', content)
  content.forEach((item) => {
    console.log('item.type:', item.type)
    const renderFunction = renderFunctions[item.type]
    if (renderFunction) {
      result += renderFunction(item)
    }
  })
  return result
}

function renderBlok(item) {
  let result = ''
  if (item.attrs.body) {
    item.attrs.body.forEach((blokItem) => {
      if (blokItem.Video && blokItem.component === 'Youtube') {
        const videoId = blokItem.Video.split('v=')[1]
        const embedUrl = `https://www.youtube.com/embed/${videoId}`
        result += `<div class="video-container relative w-full h-0 pb-[56.25%] max-w-screen-md mx-auto lg:max-h-[450px] lg:h-[450px] lg:pb-0">
            <iframe class="absolute top-0 left-0 w-full h-full" src="${embedUrl}" frameborder="0" allowfullscreen></iframe>
          </div>`;
      }
    })
  }
  return result
}

function renderDoc(item) {
  let result = ''
  if (item.content) {
    result += renderRichText(item.content)
  }
  return result
}

function renderParagraph(item) {
  let result = ''
  if (item.content) {
    let paragraphContent = ''

    item.content.forEach((textItem) => {
      if (textItem.type === 'text') {
        let textContent = textItem.text
        if (textItem.marks && textItem.marks.length > 0) {
          textItem.marks.forEach((mark) => {
            if (mark.type === 'link') {
              textContent = `<a href="${mark.attrs.href}" target="${
                mark.attrs.target
              }" linktype="${mark.attrs.linktype}" ${
                mark.attrs.uuid ? `uuid="${mark.attrs.uuid}"` : ''
              }>${textContent}</a>`
            } else if (mark.type === 'textStyle') {
              textContent = `<span style="color: ${mark.attrs.color}">${textContent}</span>`
            } else if (mark.type === 'bold') {
              textContent = `<strong>${textContent}</strong>`
            } else if (mark.type === 'italic') {
              textContent = `<em>${textContent}</em>`
            }
          })
        }
        paragraphContent += textContent
      } else if (textItem.type === 'image') {
        paragraphContent += renderImage(textItem)
      } else if (textItem.type === 'hard_break') {
        paragraphContent += '<br>'
      }
    })

    result += `<p>${paragraphContent}</p>`
  }
  return result
}

function renderHeading(item) {
  let result = ''
  if (item.attrs.level && item.content) {
    let headingContent = ''
    item.content.forEach((textItem) => {
      if (textItem.type === 'text') {
        let textContent = textItem.text
        if (textItem.marks && textItem.marks.length > 0) {
          textItem.marks.forEach((mark) => {
            if (mark.type === 'textStyle') {
              textContent = `<span style="color: ${mark.attrs.color}">${textContent}</span>`
            } else if (mark.type === 'bold') {
              textContent = `<strong>${textContent}</strong>`
            } else if (mark.type === 'italic') {
              textContent = `<em>${textContent}</em>`
            }
          })
        }
        headingContent += textContent
      }
    })
    result += `<h${item.attrs.level}>${headingContent}</h${item.attrs.level}>`
  }
  return result
}

function renderImage(item) {
  let result = ''
  if (item.attrs.src) {
    console.log('item.attrs.src:', item.attrs.src)
    result += `<img src="${item.attrs.src}" alt="${item.attrs.alt || ''}" />`
  }
  return result
}

function renderBulletList(item) {
  let result = ''
  if (item.content) {
    let listContent = ''
    item.content.forEach((listItem) => {
      listContent += `<li>${renderRichText(listItem.content)}</li>`
    })
    result += `<ul>${listContent}</ul>`
  }
  return result
}

function renderOrderedList(item) {
  let result = ''
  if (item.content) {
    let listContent = ''
    item.content.forEach((listItem) => {
      listContent += `<li>${renderRichText(listItem.content)}</li>`
    })
    result += `<ol>${listContent}</ol>`
  }
  return result
}

const resolvedRichText = computed(() => {
  console.log('props.blok:', props.blok)
  return renderRichText(props.blok.content.content)
})
const associatedArticles = ref([])
const storyblokApi = useStoryblokApi()
onMounted(async () => {
  const { data } = await storyblokApi.get('cdn/stories', {
    version: 'draft',
    starts_with: 'blog',
    is_startpage: false,
  })
  associatedArticles.value = data.stories.filter((story) =>
    props.blok.ArticlesAssocies.includes(story.uuid),
  )
})

// les tags de l'article
onMounted(() => {
  if (props.story && props.story.tag_list) {
    console.log("Tags de l'article:", props.story.tag_list)
  } else {
    console.log('Pas de tags pour cet article')
  }
})
</script>
