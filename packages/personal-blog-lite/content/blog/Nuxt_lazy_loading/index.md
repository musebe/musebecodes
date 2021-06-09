---
title: 'Lazy Loading Assets In Nuxt.js'
date: '2021-06-09'
description: 'Lazy loading backgrounds,images and videos in Nuxt.js.'
tags: ['cloudinary', 'storage', 'nuxt.js', 'videos', 'lazy-loading']
cover: './lazy_loading.png'
slug: 'lazy_loading'
---

## Overview

To improve the performance of your application and save your system's resources while loading images or videos we need to use the technique `lazy-loading`.This is the practice of deferring the loading or initialization of resources or objects until they are actually needed.
In this Mediajam, we are going to learn how to use [nuxt.js](https://nuxtjs.org) a web application framework based on Vue.js to lazy-load images and videos.

There are multiple approaches to achieve lazy loading which include:

#### **HTML Attribute**

- The HTML Image tag currently supports the `loading` attribute with the following values: `eager`, `lazy`

#### **Intersection Observer API**

- The Intersection Observer API allows you to asynchronously monitor changes in a target element's intersection with an ancestor element or with the viewport of a top-level document.

#### **JavaScript packages**

You may use plugins to lazy load media without the increased complexity of interacting with the browser-level APIs. In this session, we shall be using the [nuxt-lazy-load](https://www.npmjs.com/package/nuxt-lazy-load) package to achieve lazy-loading of images and videos as illustrated in the [codesandbox](https://codesandbox.io/s/nuxt-lazy-loading-2t7tv) below :

<iframe src="https://codesandbox.io/embed/nuxt-lazy-loading-2t7tv?fontsize=14&hidenavigation=1&theme=dark"style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"title="nuxt-lazy-loading"
allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"></iframe>

The corresponding github repository can be found [here](https://github.com/musebe/nuxt-lazy-loading.git)

## Prerequisites

To get started with the project, some knowledge of Javascript and Vue.js is recommended.

## Project Setup

To scaffold a nuxt.js application make sure you have npx installed on your working environment then run the following command :

```scaffold nuxt.js
    yarn create-nuxt-app lazy-loading
```

The command above will ask you a series of questions to set up your application. Once all questions are answered it will install all the dependencies.

After installation, navigate to the project folder and launch it :

```start_command
    yarn dev
```

## Cloudinary setup

As we shall be using Cloudinary to fetch all the images and videos to our project, the next step is to install and configure it into the application :

```installation
yarn add @nuxtjs/cloudinary
```

After the installation is done, in the `nuxt.config.js` file add the following to configure the installed Cloudinary package :

```nuxt.config.js
  modules: [
    ...
    '@nuxtjs/cloudinary',
    ...
  ],

```

Once the installation and the configuration is done, create a `.env` file and add the following cloudinary environment variables :

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

To inject the environment variables safely into the application, add the following to the `nuxt.config.js` file.

```nuxt.config.js
  privateRuntimeConfig: {
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
  },
```

The above runtime config allows passing of dynamic config and environment variables to the nuxt context

To finalize adding Cloudinary to the application add cloudinary's configuration to the `nuxt.config.js` file :

```nuxt.config.js
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    useComponent: true
  },
```

## Nuxt Lazy Load setup

We shall be depending on the [`nuxt-lazy-load`](https://www.npmjs.com/package/nuxt-lazy-load) to lazy load all our assets. Run the following command to install it :

```install
yarn add nuxt-lazy-load
```

Then let's set up the package in the configuration file to utilize it in the application :

```nuxt.config.js
  modules: [
    ...
    'nuxt-lazy-load'
    ...
  ],
```

### Fetch images and videos to display by tag

Upload images and videos to your Cloudinary account and add tags to them for easy fetching of specific assets(images/videos) via the admin API.

To ensure your API keys and Secret are kept safe and away from your front-end application, We shall perform the API calls via our [vuex](https://vuex.vuejs.org/) store.

Vuex is a Vue.js application state management pattern and library. It acts as a centralized repository for all the application's components, with rules ensuring that the state can only be changed in predictable ways. It also works with Vue's official dev tools extension to offer advanced features like zero-config time-travel debugging and state snapshot export/import.

In NuxtJs, the `nuxtServerInit` method is called only on the server-side when it is defined in the `store\index.js` and the `mode` is set up to `universal`.

```store\index.js
export const actions = {
    async nuxtServerInit({ dispatch }) {
        // Trigger load action in boards module
        await dispatch('modules/boards/load')
    }
}
```

This will trigger (dispatch) the `load` action in the `modules\boards.js` module.

After configuring the application state, the next step is to set the tags we want to use in the application then fetch the set the images and videos lists by their tags from the Cloudinary API in the `modules\boards.js` file as shown below :

```js
// We set the tags we want to obtain
export const state = () => ({
  boards: [
    { name: 'cars', images: [], videos: [] },
    { name: 'houses', images: [], videos: [] },
    { name: 'vacation', images: [], videos: [] },
  ],
});

// Fetch and set image and video list by tag from cloudinary API
export const actions = {
  async load({ state }) {
    const cloudName = this.$config.cloudinaryCloudName;

    const axios = this.$axios;

    const boards = state.boards;

    for (const index in boards) {
      const imageUrl = `http://res.cloudinary.com/${cloudName}/image/list/${boards[index].name}.json`;

      const images = await axios.$get(imageUrl);

      boards[index].images = images.resources;

      const videoUrl = `http://res.cloudinary.com/${cloudName}/video/list/${boards[index].name}.json`;

      const videos = await axios.$get(videoUrl);

      boards[index].videos = videos.resources;
    }

    state.boards = boards;
  },
};
```

## Display content

Let's now display each of the boards we have. For each we'll display the following elements:

- Hero image (Random banner image) + title
- Images
- Videos

This action is performed in the `pages/index.vue` component.

```html
<div v-for="board in this.$store.state.modules.boards.boards" :key="board.name">
  <Hero :board="board" />
  <ImageGrid :board="board" />
  <VideoGrid :board="board" />
</div>
```

The above code loops through the `boards` we have set in our `modules\boards.js` vuex module.
For each board, we will display the hero section, image grid, and video grid.

### Lazy load background image (Hero)

To start `lazy-loading` the background hero image, we'll first create a computed property where we will first get a random image from the images in the board after which we return the image url using the Cloudinary SDK as illustrated below :

```components\Hero.vue
  computed: {
    backgroundUrl() {
      // Get a random image from the images in the board
      const image =
        this.board.images[Math.floor(Math.random() * this.board.images.length)]

    // Return the image url using the cloudinary SDK
      return this.$cloudinary.image.url(image.public_id, {
        class: '...',
        width: '1920',
        height: '288',
        gravity: 'auto:subject',
        fetchFormat: 'auto',
        quality: 'auto',
        crop: 'fill',
      })
    },
  },
```

Once the background image url is fetched from Cloudinary, we then lazy load it using the ` nuxt-lazy-load` package. We do this by adding a `lazy-background` attribute to the div.

```components\Hero.vue
<div class=".." :lazy-background="backgroundUrl">
 ...
</div>
```

## Lazy loading images

To lazy load all the tagged images, we will first loop through all the images in the board after which we will use Cloudinary's vue.js `cld-image` component to display the fetched images. By using the `loading` attribute on the `cld-image` component, we are able to lazy load all the images.

```components\ImageGrid.vue
   <div v-for="image in board.images" :key="image.public_id">
     <cld-image
      :public-id="image.public_id"
       width="200"
       height="200"
       crop="fill"
       gravity="auto:subject"
       fetchFormat="auto"
       quality="auto"
       class="mb-1 border-solid w-full hover:border-yellow-500"
      :alt="`${image.public_id} image`"
       loading="lazy"
    />
 </div>
```

### Lazy loading videos

In order to `lazy-load` videos on the app we'll first loop through all videos from cloudinary:

```components\VideoGrid.vue
<div v-for="video in board.videos" :key="video.public_id">
    <lazy-video
     :video="video"
      class="mb-1 border-solid w-full hover:border-yellow-500"
    />
</div>
```

The next step is to compute all the videos urls and thumbnail urls from cloudinary's API:

```components\VideoGrid\LazyVideo.vue
  computed: {
    videoUrl() {
      return this.$cloudinary.video.url(this.video.public_id, {
        controls: true,
        crop: 'fill',
        format: 'mp4',
        width: 200,
        height: 200,
        quality: 'auto',
      })
    },

    thumbnailUrl() {
      const { url } = this.$cloudinary.video.thumbnail(this.video.public_id, {
        version: this.video.version,
        crop: 'fill',
        width: 200,
        height: 200,
      })
      return url
    },
  },
```

To lazy load videos, we'll leverage the `v-lazy-load` attribute on HTML `video` element. You may also specify the poster using the `data-poster` attribute.

```components\VideoGrid\LazyLoad.vue
  <video
    class="..."
    :data-poster="thumbnailUrl"
    autoplay
    muted
    v-lazy-load
  >
    <source :data-src="videoUrl" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
```

With all the above when you visit your browser's network tab you will realize both images and videos will load only when you scroll the page(on demand).

## Conclusion

We have seen the importance and how we can lazy-load assets in nuxt.js for improved application and web performance. Nuxt.js offers numerous capabilities and possibilities on how one can increase their application's speed through lazy-loading components.

## Resources

- [Lazy loading components in Nuxt.js](https://nuxtjs.org/examples/lazy-loading-components/)
- [Using Cloudinary With Nuxt.js](https://cloudinary.nuxtjs.org/).
- [Importance of lazy loading](https://wp-rocket.me/blog/lazyloading/)
