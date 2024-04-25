// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    modules: [
        ["@storyblok/nuxt", {accessToken: process.env.NUXT_STORYBLOK_TOKEN, cacheProvider: 'memory'}],
        '@nuxtjs/tailwindcss',
        '@nuxtjs/i18n',
    ],
    css: [
        '~/assets/css/styles.css',
    ],
    i18n: {
       locales: [
            {
                code: 'fr',
                name: 'Français'
            },
            {
                code: 'en',
                name: 'English'
            },
        ],
        defaultLocale: 'fr',
        strategy: 'prefix_expect_default',
    },
})