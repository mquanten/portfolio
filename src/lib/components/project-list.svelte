<script>
  import ProjectCard from './project-card.svelte'
</script>

<div class="flex flex-col py-8 md:py-16 md:items-center">
  <div class="flex w-screen pl-4 ml-4 overflow-x-auto md:flex-wrap md:justify-center md:pl-12 slider max-w-96">
    <ProjectCard />
    <ProjectCard />
    <ProjectCard />
  </div>
</div>