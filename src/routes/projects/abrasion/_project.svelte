<script>
  export let title
</script>

<svelte:head>
  <title>{title} | Mac</title>
  <meta property="og:type" content="article" />
  <meta property="og:article:section" content="Project" />
  <meta property="og:article:author:first_name" content="Mac" />
  <meta property="og:article:author:username" content="Mac9" />
  <meta property="og:article:author:gender" content="Male" />
</svelte:head>
<article
  class="relative flex flex-col items-center p-4 mx-auto prose max-w-prose"
>
  <a href="/projects" class="absolute top-0 left-0 py-1 pl-3 cursor-pointer">
    <svg
      class="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      ><path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M10 19l-7-7m0 0l7-7m-7 7h18"
      /></svg
    >
  </a>
  <section id="header" class="flex flex-col items-start justify-start md:p-4">
    <h1 class="m-0">{title}</h1>
  </section>
  <section id="content" class="md:p-4">
    <slot />
    <p>Thanks for reading this post.</p>
    <div class="flex flex-col items-start space-y-2">
      <h2>Mac</h2>
      <a href="/projects" class="link text-primary-700 no-underline">
        View more projects</a
      >
    </div>
  </section>
</article>
