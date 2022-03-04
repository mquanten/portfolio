<script>
  import HeroImage from '$lib/components/hero-image.svelte'
</script>

<div class="pt-24 pb-40 w-full grid place-items-center 1bg-slate-300">
  <div class="flex w-5/6 items-center justify-around">
    <div class="flex flex-col w-3/5">
      <h1 class="text-6xl font-bold">Hello, I'm Mac</h1>
      <p class="py-4">
        I'm a front end web developer using cutting edge technologies to build
        websites you'll be happy with.
      </p>
      <button
        on:click={() => (window.location.href = 'about')}
        class="primary max-w-xs">More about me</button
      >
    </div>
    <div class="w-2/5">
      <HeroImage />
    </div>
  </div>
</div>
