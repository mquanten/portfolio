<script>
  import Github from 'svelte-icons/fa/FaGithub.svelte'
  import Snapchat from 'svelte-icons/fa/FaSnapchat.svelte'
  import Envelope from 'svelte-icons/fa/FaEnvelope.svelte'
  import Instagram from 'svelte-icons/fa/FaInstagram.svelte'
</script>

<div class="py-8 flex flex-col items-center text-center prose">
  <img
    src="links.jpeg"
    alt="Mac's avatar"
    class="w-32 h-32 bg-primary-500 rounded-full shadow-lg"
  />
  <div class="flex flex-col space-y-2 max-w-[200px]">
    <h1 class="m-0">Mac</h1>
    <p>Hey I'm Mac musician, developer and skater. Check out my links below.</p>
  </div>
  <ul class="flex flex-col items-center mt-4 space-y-2 p-0 m-0 list-none">
    <a
      href="https://hyperfollow.com/nothingspecial9"
      target="_blank"
      rel="noopener noreferrer"
      class="no-underline"
    >
      <li class="px-4 w-[250px] py-2 bg-slate-100 rounded-lg shadow-lg">
        Nothing Special
      </li>
    </a>
    <a
      href="https://mac9.vercel.app/projects"
      target="_blank"
      rel="noopener noreferrer"
      class="no-underline"
    >
      <li class="px-4 w-[200px] py-2 bg-slate-100 rounded-lg shadow-lg">
        Portfolio
      </li>
    </a>
    <a
      href="https://mac9.vercel.app/blog"
      target="_blank"
      rel="noopener noreferrer"
      class="no-underline"
    >
      <li class="px-4 w-[200px] py-2 bg-slate-100 rounded-lg shadow-lg">
        Blog
      </li>
    </a>
    <a
      href="https://vm.tiktok.com/ZML44eMqN/"
      target="_blank"
      rel="noopener noreferrer"
      class="no-underline"
    >
      <li class="px-4 w-[200px] py-2 bg-slate-100 rounded-lg shadow-lg">
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
