<template>
  <div v-editable="blok" class="container mt-10 max-w-screen-xl mx-auto">
    <Head>
      <Title>Cline : {{ blok.title }}</Title>
      <Meta property="og:title" :content="`${blok.title}`" />
      <Meta property="og:image" :content="`${blok.image.filename}`" />
      <Meta property="og:description" :content="`${blok.summary}`" />
      <Meta name="twitter:description" :content="`${blok.summary}`" />
      <Meta name="twitter:image" :content="`${blok.image.filename}`" />
    </Head>

    <div class="relative">
      <img
        :src="blok.image.filename + '/m/1600x0'"
        :alt="blok.image.alt"
        class="mx-auto object-cover rounded-lg"
      />
      <div class="absolute bottom-0 left-0 rounded-lg">
        <h1 class="p-6 text-5xl md:text-8xl text-white font-bold">
          {{ blok.title }}
        </h1>
      </div>
    </div>

    <div class="grid grid-cols-3 mx-auto gap-6">
      <div class="col-span-3 md:col-span-2 mx-auto">
        <h2
          class="text-2xl text-gray-700 pb-6 my-10 text-justify border-b-2 border-gray-200"
        >
          {{ blok.summary }}
        </h2>
        <div v-html="resolvedRichText" class="mb-10 text-justify"></div>

        <div v-if="associatedArticles.length > 0">
          <p class="text-3xl font-medium">
            Ces articles pourraient vous intéresser :
          </p>
          <div class="mt-5 grid md:grid-cols-2 gap-10 place-items-start">
            <ArticleCard
              v-for="article in associatedArticles"
              :key="article.uuid"
              :article="{ ...article.content, tag_list: article.tag_list }"
              :slug="article.full_slug"
            />
          </div>
        </div>
      </div>

      <div class="col-span-3 md:col-span-1">
        <!-- Contenu pour le 1/3 restant -->
        <!-- <div v-if="studies.length > 0" class="rounded-box mb-10">
          <BaseStudiesbyarticle :studies="studies" />
        </div> -->
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
  blockquote: renderQuote,
}

function renderRichText(content) {
  let result = ''
  let previousWasHeading = false // Nouvelle variable pour garder une trace du type précédent

  content.forEach((item, index) => {
    const renderFunction = renderFunctions[item.type]
    if (renderFunction) {
      if (previousWasHeading && item.type === 'heading') {
        // Si le type précédent était un 'heading' et que le type actuel est également un 'heading', insérez un <br>
        result += '<br>'
      }
      result += renderFunction(item)
      previousWasHeading = item.type === 'heading' // Met à jour la variable pour le prochain tour de boucle
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
        result += `<div class="relative w-full pb-[56.25%] max-w-screen-md mx-auto lg:max-h-[450px] lg:h-[450px] lg:pb-0">
            <iframe class="absolute top-0 left-0 w-full h-full lg:w-full lg:h-full lg:left-0 lg:top-0" src="${embedUrl}" frameborder="0" allowfullscreen></iframe>
          </div>`
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
    const linkMark = item.marks && item.marks.find(mark => mark.type === 'link');
    if (linkMark) {
      const { href, target } = linkMark.attrs;
      result += `<a href="${href}" target="${target}">`;
    }
    result += `<img src="${item.attrs.src}" alt="${
      item.attrs.alt || ''
    }" style="max-width: 400px; max-height: 300px;" class="object-cover rounded-lg w-full h-auto md:w-1/2 lg:w-1/3" />`
    if (linkMark) {
      result += `</a>`
    }
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

function renderQuote(item) {
  let result = '';
  if (item.content) {
    let quoteContent = '';
    item.content.forEach((paragraph) => {
      if (paragraph.type === 'paragraph' && paragraph.content) {
        paragraph.content.forEach((textItem) => {
          if (textItem.type === 'text') {
            quoteContent += textItem.text;
          }
        });
      }
    });
    result += `<blockquote>${quoteContent}</blockquote>`;
  }
  return result;
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
