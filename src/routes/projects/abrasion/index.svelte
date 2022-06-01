<script context="module">
  export const load = async ({ fetch }) => {
    const posts = await fetch('/api/abrasion.json')
    const allPosts = await posts.json()

    return {
      props: {
        documents: allDocuments
      }
    }
  }
</script>

<script>
  import PostList from '$lib/components/post-list.svelte'
  export let documents
</script>

<svelte:head>
  <title>Abrasion | Mac</title>
</svelte:head>
<div class="container flex-col py-6">
  <h1 class="mb-4 title">Blog</h1>
  <PostList {documents} />
</div>

