<script>
  export let text, clickText
  function handleClick() {
    text = clickText
  }

</script>

<button class="bg-accent text-2xl p-2" on:click="{handleClick}">
  {text}
</button>