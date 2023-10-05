// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    modules: [
        ["@storyblok/nuxt", {accessToken: process.env.NUXT_STORYBLOK_TOKEN, cacheProvider: 'memory'}],
        '@nuxtjs/tailwindcss',
    ],
    css: [
        '~/assets/css/styles.css',
    ],

})
