<script>
  export let title, date, snippet, path
</script>

<a
  href={path}
  class="flex items-center w-5/6 my-4 shadow-sm rounded-2xl lg:w-1/2 md:w-4/6"
>
  <div class="p-4">
    <h2 class="text-xl font-semibold">{title}</h2>
    <span class="text-xs text-slate-500">{date}</span>
    <p class="py-2 line-clamp-2">
      {snippet}
    </p>
    <button class="link">Read more</button>
  </div>
</a>
