<script>
  export let title, date, image, snippet, technologies
</script>

<svelte:head>
  <title>{title} | Mac</title>
  <meta name="description" content={snippet} />
  <meta property="og:description" content={snippet} />
  <meta property="og:type" content="article" />
  <meta property="og:article:published_time" content={date} />
  <meta property="og:article:section" content="Project" />
  <meta property="og:article:author:first_name" content="Mac" />
  <meta property="og:article:author:username" content="Mac9" />
  <meta property="og:article:author:gender" content="Male" />
  <meta property="og:article:tag" content={technologies} />
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
    <img class="rounded-2xl aspect-2" src={image} alt={title} />
    <h1 class="m-0">{title}</h1>
    <div class="flex justify-start items-center m-0 p-0 space-x-2">
      {#each technologies as tech}
      {#if tech === 'stripe'}
        <img src='https://thumbs.bfldr.com/at/frwcjft3nmmn6fccbt79bcm8?expiry=1659648579&fit=bounds&height=162&sig=MTc3YTZlOTJlYTAwZDI5ZTlhN2E3NjIzMTMxOGQ3NzQzNTkyN2JjYw%3D%3D&width=262'           alt={title}
             class="w-5 h-5 m-0 my-1"
        />
      {:else}
        <img
          src={tech === 'tw'
            ? `https://cdn. : `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${tech}/${tech}-original.svg`}
          alt={title}
          class="w-5 h-5 m-0 my-1"
        />
        {/if}
      {/each}
    </div>
    <span class="text-slate-500">{date}</span>
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
