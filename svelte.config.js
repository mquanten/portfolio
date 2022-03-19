import adapter from '@sveltejs/adapter-static'
import {mdsvex} from 'mdsvex'
import relativeImages from 'mdsvex-relative-images'
import preprocess from 'svelte-preprocess'

/** @type {import('@sveltejs/kit').Config} */
export default {
  kit: {
    adapter: adapter({
      pages: 'public',
      precompress: true
    })
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
