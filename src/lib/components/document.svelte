<script>
  export let title, path
</script>

<a
  href={path}
  class="flex items-center w-5/6 my-4 shadow-sm rounded-2xl lg:w-1/2 md:w-4/6"
>
  <div class="p-4">
    <h2 class="text-xl font-semibold">{title}</h2>
    <button class="link">Read</button>
  </div>
</a>
