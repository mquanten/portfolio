<script>
  import ProjectCard from "./project-card.svelte"
  export let projects
</script>

<div class="flex snap-x snap-mandatory flex-col md:items-center">
  <div
    class="flex w-screen py-2 overflow-x-auto md:flex-wrap justify-center slider max-w-96"
  >
    {#each projects as project}
      <ProjectCard {...project.meta} path={project.path} />
    {/each}
  </div>
</div>
