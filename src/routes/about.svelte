<svelte:head>
  <title>About | Mac</title>
</svelte:head>
<div class="container flex-col py-6">
  <h1 class="title">About</h1>
  <img src="avatar.jpeg" alt="avatar" class="w-32 h-32 my-4 rounded-full" />
  <article class="max-w-lg mb-8 prose lg:mb-6">
    <p>
      Hello again, as you probably already found out from my home page, my name
      is Mac and I am a frontend developer. I specialise in building sleek, fast
      and easy to maintain websites these sites can hook up to a CMS if you need
      to be able to control your data, I can even add more app like
      functionality such as user sign up and much more.
    </p>
    <p>
      In my free time, I enjoy writing music in various genres, though I mostly
      specialise in pop punk. I also play a few video games now and then and
      would love to make my own one day.
    </p>
    <p>
      Anyway enough about me, you are probably more interested in the work I am
      capable of. To have a look through my projects you can click the button
      below. Make sure you click on each project to see the tools I used and
      other interesting information.
    </p>
    <h2 class="-mt-1">Mac</h2>
  </article>
  <div class="flex items-center space-x-2">
    <button on:click={() => (window.location.href = '/blog')}
      >Read my blog</button
    >
    <button
      class="primary"
      on:click={() => (window.location.href = '/projects')}>View my work</button
    >
  </div>
</div>
