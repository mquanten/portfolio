<script>
  import PostItem from './post-item.svelte'
  export let posts
</script>

<div class="flex flex-col items-center">
  {#each posts as post}
    <PostItem {...post.meta} path={post.path} />
  {/each}
</div>
