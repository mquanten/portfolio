<script>
  export let title, path;
</script>

<a href={path} class="flex items-center max-w-md my-4 shadow-sm rounded-2xl">
  <div class="p-4">
    <h2 class="text-xl font-semibold">{title}</h2>
    <button class="link">Read</button>
  </div>
</a>
