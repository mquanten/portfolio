import vercel from '@sveltejs/adapter-vercel';
import image from 'svelte-image'
import { mdsvex } from 'mdsvex'
import relativeImages from 'mdsvex-relative-images'
import preprocess from 'svelte-preprocess'

/** @type {import('@sveltejs/kit').Config} */
export default {
  kit: {
    adapter: vercel()
  },
  extensions: ['.svelte', '.md'],
  preprocess: [
    image(),
    preprocess(),
    mdsvex({
      extensions: ['.md'],
      remarkPlugins: [relativeImages],
      layout: {
        projects: 'src/routes/projects/_project.svelte',
        blog: 'src/routes/blog/_blog.svelte',
        document: 'src/routes/projects/abrasion/_document.svelte'
      }
    })
  ]
}
