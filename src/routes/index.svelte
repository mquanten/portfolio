<script context="module">
  export const load = async ({ fetch }) => {
    const projects = await fetch('/api/projects.json')
    const allProjects = await projects.json()

    return {
      props: {
        projects: allProjects.slice(0, 3)
      }
    }
  }
</script>

<script>
  import Hero from '$lib/components/hero.svelte'
  import ProjectList from '$lib/components/project-list.svelte'
  export let projects
</script>

<svelte:head>
  <title>Mac | Frontend Developer</title>
</svelte:head>
<Hero />
{#if projects.length > 0}
  <div class="container flex-col">
    <h2 class="title">Projects</h2>
    <ProjectList {projects} />
    <button
      class="primary"
      on:click={() => (location.href = '/projects')}
    >
      View All
    </button>
  </div>
{/if}
