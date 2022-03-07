<script context="module">
  export const load = async ({ fetch }) => {
    const posts = await fetch('/api/blog.json')
    const allPosts = await posts.json()

    return {
      props: {
        posts: allPosts
      }
    }
  }
</script>

<script>
  import PostList from '$lib/components/post-list.svelte'
  export let posts
</script>

<svelte:head>
  <title>Blog | Mac</title>
</svelte:head>
<div class="container flex-col py-6">
  <h1 class="mb-4 title">Blog</h1>
  <PostList {posts} />
</div>
