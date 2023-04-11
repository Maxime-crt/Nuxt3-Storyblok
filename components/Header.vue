<template>
  <header class="w-full h-24 bg-[#f7f6fd]">
    <div class="container h-full mx-auto flex items-center justify-between">
      <NuxtLink to="/">
        <h1 class="text-grey-800 text-3xl font-bold">My Blog</h1>
      </NuxtLink>

      <nav>
        <ul class="flex space-x-8 text-lg font-bold">
          <li>
            <NuxtLink to="/blog" class="hover:text-grey-800">Blog</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/about" class="hover:text-grey-800">About me</NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>
