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
<div class="container flex-col">
  <h2 class="pl-4 title md:pl-12">Projects</h2>
  <ProjectList {projects} />
  <a href="/about" role="button" class="mt-4 ml-4 md:ml-12 primary">
    View All
  </a>
</div>
