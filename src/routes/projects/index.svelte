<script context="module">
  export const load = async ({ fetch }) => {
    const projects = await fetch('/api/projects.json')
    const allProjects = await projects.json()
    console.log(allProjects)

    return {
      props: {
        projects: allProjects
      }
    }
  }
</script>

<script>
  import ProjectList from '$lib/components/project-list.svelte'
  export let projects
</script>

<svelte:head>
  <title>Projects | Mac</title>
</svelte:head>
<div class="container flex-col py-6">
  <h1 class="title">Projects 123</h1>
  <ProjectList {projects} />
  {JSON.stringify(projects)}
</div>
