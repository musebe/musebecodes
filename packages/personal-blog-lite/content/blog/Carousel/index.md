---
title: 'Next.js Image Carousel'
date: '2021-03-20'
description: An carousel made with next.js .
tags: ['next.js', 'storage', 'cloudinary']
cover: './carousel.jpeg'
slug: 'carousel'
---

# **BACKGROUND**

An image carousel is a great way to showcase specific images on your website. This can enhance the overall visual appearance of your website and also improve the general user experience.

In this article, you'll learn how you can prototype a simple image carousel using Cloudinary and [Next.js](https://nextjs.org/) as illustrated in the Codesandbox below.

<iframe src="https://codesandbox.io/embed/mediajamimagecarousel-fnjjr?fontsize=14&hidenavigation=1&theme=dark"style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"title="mediajam_image_carousel"
allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"></iframe>

## **Prerequisites**

Before getting started, ensure you have the following installed:

- Installed [Node.js.](https://nodejs.org/en/)
- Basic understanding of JavaScript/React
- [Cloudinary Account](<(https://cloudinary.com/signup)>)

## **Project Setup**

To get started with next.js, navigate to the project directory of your choice and run :

```js
npx create-next-app carousel
```

The command will set up everything automatically for you. After the installation is complete, follow the instructions on your terminal to start the development server.

### **Set Up Dependencies**

Install the following dependencies in your project:

```
npm i cloudinary react-icons
```

The cloudinary package installed will be used by the carousel to interact with the images stored in cloudinary while react icons will be used to display image navigation arrows on the carousel.

As we shall be using cloudinary for retrieval of the carousel images, create a [.env.local](https://nextjs.org/docs/basic-features/environment-variables) file in the root of the project directory. This is where we shall store all our environment variables configurations. Content stored in this file are not included in the browser build. This file should always be included in your `gitignore` file as it stores sensitive information.

To the file add the following keys :

```.env.local
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Their respective values shall be acquired from the [Cloudinary](https://cloudinary.com/users/login) dashboard.

## **Cloudinary setup**

Once you have created an account on Cloudinary, from the dashboard, copy your `cloud_name, api_key & api_secret` and add them as values to the respective keys in the `.env.local` file created in the application.

The next step is to create a folder where all the carousel images will be stored. Click on the Media Library tab and create a folder, name it `Carousel` as we shall programmatically access the contents of the folder.

The last step is to upload images you would want to see on the carousel to the folder. For demo purposes, you can download free stock photos from [Pexels](https://www.pexels.com).

To interact with the images stored in Cloudinary from the application, create a `utils` folder in the root project structure of your application and add a `cloudinary.js` file in it.

This file shall be used to store all the snippets that you will use throughout the application to interact with cloudinary.

Paste the following to the file:

```cloudinary.js
import cloudinary from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

```

From the code above, we imported the cloudinary package and configured the required configuration keys to access all the assets stored in cloudinary. By using `process.env` one can access values stored in the `.env.local` file.

The next step is to create an asynchronous function that will fetch all images from cloudinary :

```cloudinary.js
export async function getAllImages() {

  const response = await cloudinary.v2.api.resources({
    type: 'upload',
    prefix: 'Carousel',
  });

  const sliderData = response.resources.map((image, key) => ({
    id: key,
    ...image,
  }));

  return sliderData;
}
```

By using `cloudinary.v2.api.resources`, one can manage and access all the resources(images) stored in the `Carousel` folder. After querying the Images stored in the folder, convert the json response received into an array of objects for easy image mapping when it comes to fetching data on the frontend.

The last configuration we need to make for the next.js application to communicate with cloudinary effectively is to create a `next.config.js` file in the root project structure and add the following to it.

```next.config.js

module.exports = () => {
  return {
    images: {
      domains: ['res.cloudinary.com'],
    },
  };
};

```

This will allow us to let Cloudinary optimize images as opposed to Next's built-in image optimization.

With all the above setup and configurations, it's time to spin up the server.

## **Server setup**

Next.js supports writing server-side code rendering out of the box. For this to happen, navigate to the page's directory and create an `api` folder. Inside it, create a `cloudinary.js` file and paste the following :

```cloudinary.js
import { getAllImages } from '../../utils/cloudinary';


async function handler(req, res) {
  if (req.method === 'GET') {
    try {

      const sliderData = await getAllImages();

      res.status(200).json(sliderData);

    } catch (error) {

      res.status(500).json({ message: 'Getting images failed.' });
    }
  }
}

export default handler;
```

From the above, we first import the `getAllImages` function we created in the utils folder to be able to access all the images stored in cloudinary, then created an if statement to define the method `GET` to fetch data from the defined endpoint.
Then create a `try & catch` statement where we assign the `getAllImages` function to the variable `sliderData` to fetch the data or catch all the errors that might occur in the process of fetching the images from cloudinary. Lastly, we export the function so that it is globally available.

To test out if the endpoint works. visit your browser or [postman](https://www.postman.com) and make a `GET` request to endpoint ` http://localhost:3000/api/cloudinary`. This should produce the following response :

![](response.png)

## **Image Carousel Component**

To be able to consume the api we created and show all the data to the application users, create a components folder on the root of the application and add an `ImageSlider.js` file to it. This will be a normal react component.

#### **Component setup**

As we shall be leveraging on react hooks to fetch and update the carousel, create a functional component as follows:

```ImageSlider.js

import React, { useState, useEffect } from 'react';

const ImageSlider = ({ slides }) => {
  const [sliderData, setSliderData] = useState([]);

  useEffect(() => {
    fetch('/api/cloudinary')
      .then((response) => response.json())
      .then((data) => {
        setSliderData(data);
      });
  }, []);

  return (

  );
};

export default ImageSlider;
```

Above, we import the `useState` hook from React. It lets us keep the local state in a function component. We then declared a new state variable by calling the useState hook which returns a pair of values, to which we give names `sliderData &setSliderData`

By using `useEffect` we fetch all the images from the API and set the data in the local state of the component. This hook only runs when the component mounts and updates hence fetching data(images) every time it mounts or updates.

After fetching all the data from the Api, we used the `map()` function inside the return statement to iterate over the image data to render all the images as illustrated below :

```ImageSlider.js
<section className='slider'>

  {sliderData.map((slide, index) => {
    return <Image src={slide.url} alt={slide.url} width={600} height={600} />
  })}

</section>
```

#### **NEXT.JS IMAGE OPTIMIZATION**

To optimize how we load, optimize and resize images on various screen sizes, we utilized the [image component](https://nextjs.org/docs/basic-features/image-optimization) which resizes all the carousel images on the fly.

To use the image component we need to import the next image-component at the top of the page:

```import
import Image from 'next/image';
```

#### **CAROUSEL NAVIGATION**

To be able to navigate through the fetched images, create functions inside the return statement that shall be responsible for handling clicks to:

1. Previous slide/Image

```prev.js
 const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
 };
```

2. Next slide/Image

```next.js
 const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };
```

3. Display Current/Active image

```active.js
 if (!Array.isArray(slides) || slides.length <= 0) {
    return null;
  }
```

To finalize this component, so that we can use it in our main index page, we need to use the react icons package we installed earlier to show navigation icons and consume the functions we defined above. This should be done inside the return statement.

```icons
<FaArrowAltCircleLeft className='left-arrow' onClick={prevSlide} />

<FaArrowAltCircleRight className='right-arrow' onClick={nextSlide} />
```

To use the icons, at the top of the page, we need to import them from react-icons:

```import
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from 'react-icons/fa';
```

Lastly, we need to share data from this component with the index. To achieve this we shall use props hence passing `{slides}` as a parameter inside the component.

## **Image Display**

To display the `ImageSlide.js` component we just created, navigate to the pages folder and on the default `index.js ` file, create a `Homepage` function and embed the image slider component as shown below.

```Homepage.js
function HomePage({ sliderData }) {
  return (
    <div>
      <ImageSlider slides={sliderData} />
    </div>
  );
}
```

The function accepts props data from the parent data component hence passing `slides={sliderData}` to the component.

Finally, we shall be relying on next's lifecycle method `getStaticProps` to render the images to the users. This will enable us to generate all the images at build time hence serving static data to the end-users.

This will be achieved through :

```getstaticprops
export async function getStaticProps() {
  const res = await fetch('http://localhost:3000/api/cloudinary');
  const sliderData = await res.json();
  return {
    props: {
      sliderData,
    },
    revalidate: 1800,
  };
}

```

## **Conclusion**

You have successfully built an image carousel leveraging Next's massive capabilities such as out-of-the-box API, image component, and getstaticprops life cycle methods while using cloudinary as your image storage and manipulation tool.
Feel free to improve the application and make it better.

For reference visit:

- [Next's Documentation](https://nextjs.org/docs)
- [Digital Asset Management Training](https://training.cloudinary.com)
- [Admin API reference](https://cloudinary.com/documentation/admin_api)
