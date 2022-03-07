---
title: My New Site
date: '07.03.22'
cover: './images/my-new-site.jpeg'
snippet: If you're reading this you are already on my new site, so I'd have a quick look around and see what sort of things I have done with it.
tags: ['svelte', 'web', 'portfolio']
---

If you're reading this you are already on my new site, so I'd have a quick look around and see what sort of things I have done with it.

## Svelte

I chose to use [Svelte](https://svelte.dev) which was recently picked up by [Vercel](https://vercel.com), my reasons for choosing it was how well svelte it is, the files are sleek with your styles, scripts and template all living within a `.svelte` file which makes for nice streamlined components that are quick to manage.

Another major benefit of Svelte is that it compiles down to HTML, CSS and JS during the build step which means that unlike React there is no client side rendering, the result is an incredibly performant app like feeling on all websites.

## Tailwind CSS

I learned about Tailwind a few years ago, initially I wasn't sure on it however I have used it a couple of times since then and chose it due to the ability to change themes incredibly easily within the `tailwind.config.js` file, as well as how quickly you can prototype new components. Some people claim that the code becomes a little messy, however that can be fixed by abstracting away your styles into individual components and even into there own stylesheets using the `@apply` rule, honestly though you get used to the styles being in that location pretty fast and the development speed is definitely worthwhile.

## Markdown

Thanks to the lovely [mdsvex](https://mdsvex.pngwn.io) package, writing posts and project pages within Markdown is an absolute dream, those of you who are familiar with [Markdown](https://www.markdownguide.org/basic-syntax/) know how convenient it is to write with and with mdsvex it takes minimal setup as well as allowing for custom layouts nested within your main Svelte layout.

## Google Lighthouse Scores

Here is a little screenshot detailing how this website scores on Lighthouse, Googles website page quality tool. ![Lighthouse Scores](./images/lighthouse.png)
