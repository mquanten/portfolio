<script>
  import Hero from '$lib/components/hero.svelte'
  import Projects from '$lib/components/project-list.svelte'
</script>

<svelte:head>
  <title>Mac | Frontend Developer</title>
</svelte:head>
<Hero />
<div class="container flex-col">
  <h2 class="pl-4 title md:pl-12">Projects</h2>
  <Projects />
  <button
    class="mt-4 ml-4 md:ml-12 primary"
    on:click={() => (window.location.href = '/projects')}
  >
    View All
  </button>
</div>
