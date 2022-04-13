<script>
  import Github from 'svelte-icons/fa/FaGithub.svelte'
  import Snapchat from 'svelte-icons/fa/FaSnapchat.svelte'
  import Envelope from 'svelte-icons/fa/FaEnvelope.svelte'
  import Instagram from 'svelte-icons/fa/FaInstagram.svelte'
</script>

<div class="py-8 max-h-screen flex flex-col items-center justify-center text-center prose">
  <img
    src="links.jpeg"
    alt="Mac's avatar"
    class="w-32 h-32 bg-primary-500 rounded-full shadow-lg"
  />
  <div class="flex flex-col space-y-2 max-w-[300px]">
    <h1 class="m-0">Mac</h1>
    <p>Hey I'm Mac musician, developer and skater. Check out all of my links below.</p>
  </div>
  <ul class="links-list">
    <a
      href="https://hyperfollow.com/nothingspecial9"
      target="_blank"
      rel="noopener noreferrer"
      class="no-underline"
    >
      <li>
        Nothing Special
      </li>
    </a>
    <a
      href="https://mac9.vercel.app/projects"
      target="_blank"
      rel="noopener noreferrer"
      class="no-underline"
    >
      <li>
        Portfolio
      </li>
    </a>
    <a
      href="https://mac9.vercel.app/blog"
      target="_blank"
      rel="noopener noreferrer"
      class="no-underline"
    >
      <li>
        Blog
      </li>
    </a>
    <a
      href="https://vm.tiktok.com/ZML44eMqN/"
      target="_blank"
      rel="noopener noreferrer"
      class="no-underline"
    >
      <li>
        TikTok
      </li>
    </a>
  </ul>
  <div class="flex flex-wrap justify-center space-x-2 mt-4 items-center">
    <a href="https://github.com/mac-h95" class="icon">
      <Github />
    </a>
    <a href="mailto:mac.develops@icloud.com" class="icon">
      <Envelope />
    </a>
    <a class="icon" href="https://instagram.com/mac.h95">
      <Instagram />
    </a>
    <a
      class="icon"
      href="https://www.snapchat.com/add/mac.h95"
    >
      <Snapchat />
    </a>
  </div>
</div>

<style>
  .icon {
    width: 32px;
    height: 32px;
  }
</style>
