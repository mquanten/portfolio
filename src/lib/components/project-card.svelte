<script>
  export let path, image, title, technologies, snippet
</script>

<a
  href={path}
  class="self-center snap-center flex-shrink-0 w-64 h-full mr-4 shadow-xl rounded-2xl md:mt-8 bg-slate-200 md:hover:scale-105 "
>
  <img
    src={image}
    alt={title}
    class="w-full h-36 bg-red-100 rounded-tl-2xl rounded-tr-2xl"
  />
  <div class="flex flex-col items-start p-4 space-y-2">
    <h2 class="text-2xl">{title}</h2>
    <ul class="flex items-center space-x-2">
      {#each technologies as tech}
        <li class="inline-block">
          <img
            src={tech === 'tw'
              ? `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg`
              : `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${tech}/${tech}-original.svg`}
            alt={title}
            class="w-5 h-5"
          />
        </li>
      {/each}
    </ul>
    <p class="my-3 line-clamp-3">
      {snippet}
    </p>
    <button class="link">View more</button>
  </div>
</a>
