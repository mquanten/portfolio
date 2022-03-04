<script>
  import ProjectCard from './project-card.svelte'
</script>

<div class="container flex-col items-start md:items-center">
  <h2 class="pl-4 mb-4 title md:pl-12">
    Projects
  </h2>
  <div class="flex w-screen pl-4 ml-4 overflow-x-auto md:flex-wrap md:justify-center md:pl-12 slider max-w-96">
    <ProjectCard />
    <ProjectCard />
    <ProjectCard />
  </div>
  <button
    class="mt-4 ml-4 md:ml-12 primary"
    on:click={() => (window.location.href = '/projects')}
  >
    View All
  </button>
</div>

<style>
  .slider {
    -webkit-overflow-scrolling: touch;
    scroll-snap-type: x mandatory;
  }
</style>
