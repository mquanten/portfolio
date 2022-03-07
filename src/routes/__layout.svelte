<script>
  import { page } from '$app/stores'
  import Logo from '$lib/components/logo.svelte'
  import '../app.css'
  let year = new Date().getFullYear()
</script>

<header class="flex items-center justify-between px-4 py-6 md:px-12 2xl:px-96">
  <Logo />
  <nav class="relative group">
    <button class="menu" aria-label="menu button">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          d="M4 8h16"
          class="rotate-0 translate-x-0 translate-y-0 group-hover:rotate-[-45deg] group-hover:translate-y-[18px] group-hover:translate-x-[-2px]"
        />
        <path
          d="M4 14h16"
          class="rotate-0 translate-x-0 translate-y-0 group-hover:rotate-[45deg] group-hover:translate-y-[-3px] group-hover:translate-x-[14px]"
        />
      </svg>
    </button>
    <ul
      class="absolute z-10 flex-col hidden w-40 px-4 py-6 shadow-xl bg-slate-50 rounded-2xl right-3 group-hover:flex"
    >
      {#each ['', 'About', 'Projects', 'Blog'] as route}
        <li
          class="p-1 rounded-md"
          class:active={route.toLowerCase() === $page.url.pathname.slice(1)}
        >
          <a
            href={route === '' ? '/' : `/${route.toLowerCase()}`}
            class="py-1 pr-16">{route === '' ? 'Home' : route}</a
          >
        </li>
      {/each}
      <li class="flex items-center justify-start pl-1 mt-4">
        <a href="https://github.com/mquanten" class="mr-3" aria-label="GitHub">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class=""
            viewBox="0 0 16 16"
            width="16"
            height="16"
            ><path
              fill-rule="evenodd"
              d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
            /></svg
          >
        </a>
        <a
          href="mailto:mac.develops@icloud.com"
          class="mr-3"
          aria-label="email"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
            />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
        </a>
      </li>
    </ul>
  </nav>
</header>

<main class="min-h-screen"><slot /></main>

<footer
  class="flex items-center justify-between px-4 py-6 md:p-12 bg-primary-800 text-zinc-50"
>
  <div class="text-sm">
    <Logo />
    <p class="mt-2">Blazing fast websites.</p>
    <p>Copyright © {year}</p>
    <div class="flex items-center mt-2 space-x-4">
      <a href="https://github.com/mquanten" aria-label="GitHub">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class=""
          viewBox="0 0 16 16"
          width="16"
          height="16"
          fill="currentColor"
          ><path
            fill-rule="evenodd"
            d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
          /></svg
        >
      </a>
      <a href="mailto:mac.develops@icloud.com" aria-label="email">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
          />
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
      </a>
    </div>
  </div>
</footer>
