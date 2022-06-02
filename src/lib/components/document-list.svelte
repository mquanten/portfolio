<script>
  import Document from "./document.svelte";
  export let documents;
</script>

<div class="flex flex-col items-center flex-wrap">
  {#each documents as document}
    <Document {...document.meta} path={document.path} />
  {/each}
</div>
