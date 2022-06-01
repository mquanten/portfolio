<script context="module">
  export const load = async ({ fetch }) => {
    const documents = await fetch('/api/abrasion.json')
    const allDocuments = await documents.json()

    return {
      props: {
        documents: allDocuments
      }
    }
  }
</script>

<script>
  import DocumentList from '$lib/components/document-list.svelte'
  export let documents
</script>

<svelte:head>
  <title>Abrasion | Mac</title>
</svelte:head>
<div class="container flex-col py-6">
  <h1 class="mb-4 title">Abrasion</h1>
  <p class="max-w-lg my-4 text-center">
    Abrasion is an upcoming Action Platform game I am working on, you can read
    my design documentation and keep up to date with the progress by clicking
    the button below.
  </p>
  <button
    class="primary"
    on:click={() => (location.href = '/projects/abrasion/Index')}
  >
    Game Design Documents
  </button>
  <DocumentList {documents} />
</div>
