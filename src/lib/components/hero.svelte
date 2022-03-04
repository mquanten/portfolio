<script>
  import HeroImage from './hero-image.svelte'
</script>

<div class="container">
  <div
    class="flex md:w-5/6 items-center text-center md:text-left justify-around"
  >
    <div class="flex w-5/6 flex-col md:w-3/5">
      <h1 class="text-4xl md:text-6xl font-bold md:-mt-32">Hello, I'm Mac</h1>
      <p class="py-4">
        I'm a front end web developer using cutting edge technologies to build
        websites you'll be happy with.
      </p>
      <button
        on:click={() => (window.location.href = 'about')}
        class="primary max-w-xs">More about me</button
      >
    </div>
    <div class="hidden md:block w-2/5">
      <HeroImage />
    </div>
  </div>
</div>
