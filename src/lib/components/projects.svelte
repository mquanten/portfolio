<script>
  import ProjectCard from './project-card.svelte'
</script>

<div class="container flex-col items-start">
  <h2
    class="text-1xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 pl-4 mb-4"
  >
    Projects
  </h2>
  <div class="slider w-screen flex md:flex-flow overflow-x-auto pl-4">
    <ProjectCard />
    <ProjectCard />
  </div>
  <button
    class="primary ml-4 mt-4"
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
