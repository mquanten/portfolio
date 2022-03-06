<script>
  import { page } from '$app/stores'
  export let title, date, cover, snippet, tags
</script>

{#if $page.url.pathname === '/projects'}
<slot/>
{/if}

<svelte:head>
  <title>{title} | Mac</title>
  <meta name='description' content={snippet} />
  <meta property="og:description" content={snippet} />
  <meta property="og:type" content="article" />
  <meta property="og:article:published_time" content={date} />
  <meta property="og:article:section" content="Blog" />
  <meta property="og:article:author:first_name" content="Mac" />
  <meta property="og:article:author:username" content="Mac9" />
  <meta property="og:article:author:gender" content="Male" />
  <meta property="og:article:tag" content={tags} />
</svelte:head>
<article class='relative flex flex-col items-center p-2 mx-auto prose max-w-prose'>
  <div class='absolute top-0 left-0 py-1 pl-3 cursor-pointer' on:click={() => window.location.href='/blog'}>
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
  </div>
  <section id='header' class='flex flex-col items-start justify-start p-4 mt-12'>
    <img class='rounded-2xl' src={cover} alt={title}/>
    <h1 class='m-0'>{title}</h1>
    <span class='text-slate-500'>{date}</span>
  </section>
  <section id='content' class="p-4">
    <slot/>
    <p>Thanks for reading this post.</p>
    <div class='flex flex-col items-start space-y-2'>
      <h2>Mac</h2>
      <button class='link' on:click={() => window.location.href='/blog'}>Read more posts</button>
    </div>
  </section>
</article>
