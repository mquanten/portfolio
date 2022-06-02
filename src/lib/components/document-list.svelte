<script>
  import Document from "./document.svelte";
  export let documents;
</script>

<div class="flex flex-col flex-wrap items-center w-screen">
  {#each documents as document}
    <Document {...document.meta} path={document.path} />
  {/each}
</div>
