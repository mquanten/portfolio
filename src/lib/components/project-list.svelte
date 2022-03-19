<script>
  import ProjectCard from "./project-card.svelte"
  export let projects
</script>

<div class="flex snap-x snap-mandatory flex-col md:items-center">
  <div
    class="flex w-screen py-8 overflow-x-auto md:py-24 md:flex-wrap justify-center slider max-w-96"
  >
    {#if projects.length < 1}
      <div class="prose flex flex-col items-center">
        <h2>There's nothing here yet.</h2>
        <p>Keep your eyes on this space.</p>
      </div>
    {/if}
    {#each projects as project}
      <ProjectCard {...project.meta} path={project.path} />
    {/each}
  </div>
</div>
