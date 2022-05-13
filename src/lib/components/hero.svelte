<script>
  import HeroImage from './hero-image.svelte'
</script>

<div class="container mx-auto max-w-[80%]">
  <div
    class="flex items-center justify-center text-center md:justify-around md:w-5/6 md:text-left"
  >
    <div class="flex flex-col w-5/6 md:w-3/5 lg:w-2/4">
      <h1 class="text-4xl font-bold text-primary-800 md:-mt-32 md:text-6xl">
        Hello, I'm Mac
      </h1>
      <p class="py-10 md:py-4">
        an avid frontend developer utilising cutting edge technologies to build
        websites you'll be happy with.
      </p>
      <button
        on:click={() => (window.location.href = 'about')}
        class="self-center max-w-xs px-12 lg:self-auto md:px-auto primary"
        >More about me</button
      >
    </div>
    <div class="hidden w-2/5 md:1/5 md:block">
      <HeroImage />
    </div>
  </div>
</div>
