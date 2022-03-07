import adapter from '@sveltejs/adapter-auto'
import { mdsvex } from 'mdsvex'
import relativeImages from 'mdsvex-relative-images'
import preprocess from 'svelte-preprocess'

/** @type {import('@sveltejs/kit').Config} */
export default {
  kit: {
    adapter: adapter()
  },
  extensions: ['.svelte', '.md'],
  preprocess: [
    preprocess(),
    mdsvex({
      extensions: ['.md'],
      remarkPlugins: [relativeImages],
      layout: {
        projects: 'src/routes/projects/_project.svelte',
        blog: 'src/routes/blog/_blog.svelte'
      }
    })
  ]
}
