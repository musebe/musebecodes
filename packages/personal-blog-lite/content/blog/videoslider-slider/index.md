---
title: 'Image to video imageslider'
date: '2021-06-05'
description: 'An Image to video image carousel.'
tags: ['cloudinary', 'storage', 'images', 'video']
cover: './videoslider.jpeg'
---

## **BACKGROUND**

A video and image slider is one of the most popular features, specifically on homepages. Basically, it’s a slideshow that comprises images, videos, voice overs/music and text that may either scroll automatically or let visitors take charge. In This article we shall be converting images into video slideshows as illustrated in the code sandbox below :

<iframe src="https://codesandbox.io/embed/image-video-slider-jce04?fontsize=14&hidenavigation=1&theme=dark"style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"title="image-videoslider"allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"></iframe>

## **Prerequisites**

To complete this tutorial, you’ll need:

- An understanding of JavaScript and React
- [FFmpeg](http://ffmpeg.org) installed on your local machine. You can find how to install this [here](http://ffmpeg.org/download.html). This installation will be used by the [videoshow](https://www.npmjs.com/package/videoshow) npm package to convert images to videos.

## **Setting Up the Sample Project**

The easiest way to generate a Next.js by using the `create-next-app` CLI

```installation
npx create-next-app videoshow
# or
yarn create next-app videoshow
```

Change into the new project directory and open the project in the code editor of your choice :

```change directory
cd videoshow
```

The next step is to install the project dependencies :

```
npm i cloudinary cloudinary-react videoshow
```

This will install [cloudinary](https://www.npmjs.com/package/cloudinary), [cloudinary-react](https://www.npmjs.com/package/cloudinary-react) and the [videoshow](https://www.npmjs.com/package/videoshow) packages.

## **Environment Variables Setup**

Once we convert our images to video we shall store them to Cloudinary. You will need to [login](https://cloudinary.com/users/login) or [create](https://cloudinary.com/users/register/free) a free account with the platform.

Once this is done create a `.env.local` file in your root project structure and populate the following with your environment keys :

```.env.local
NEXT_PUBLIC_CLOUDINARY_CLOUD=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_UPLOAD_PRESET=
```

If you wish to store your videos in a specific folder, you can do so by creating an unsigned upload preset. You can learn more on how to achieve this [here](https://cloudinary.com/documentation/upload_presets).

## **Converting Images To Video Slideshows and Uploading Them To Cloudinary**

> For this section, we will need some images and music that will be combined in the process of converting images to a video slideshow. You can download 3 or more free images of the same product from [Pexels](https://www.pexels.com/). For royalty free music you can use [Bensound](https://www.bensound.com).

Create an images folder at the root project structure and place all the downloaded assets there.

The next step is to create an API route which will enable us convert and upload the images into a video slideshow then upload the video to cloudinary for storage.

Navigate to the `api` folder found inside the pages directory and create an `upload.js` file.
The next step is to initialize the videoshow and Cloudinary packages. Add the following to the file :

```initialize
const cloudinary = require('cloudinary').v2;
const videoshow = require('videoshow');

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
```

The next step is to import all the images we would like to convert. Create an array of objects pointing each to the specific image paths. To add captions to the specific images in the slideshow add a caption to the specific image paths.

```import images
const imagesToConvert = [
    {
      path: './images/(image_name)',
      caption: '(Caption To The Image)',
    },
  ];
```

After importing all the images, create a `handleconvert` function that will accept images, the path to your music/audio file and the output path where the converted video will be stored once the images are converted using the videoshow library.

```convert images function
const handleConvert = (images, audioPath, outputPath) => {
  return new Promise((resolve, reject) => {
    videoshow(images)
      .audio(audioPath)
      .save(outputPath)
      .on('error', function (err, stdout, stderr) {
        reject({ err, stdout, stderr });
      })
      .on('end', function (output) {
        resolve(output);
      });
  });
};
```

Once the images have been converted into the video slideshow, The function below will upload the converted video to Cloudinary for storage. To store the videos in a specific folder in cloudinary you will need to specify the name of the folder when creating your upload preset.

```Upload to Cloudinary function
const handleVideoUpload = async (filePath) => {
  return new Promise((resolve,reject)=>{
    cloudinary.uploader.upload_large(filePath, {
    resource_type: 'video',
    upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
    chunk_size: 6000000,
  },(error,result) => {

    if(error){
      reject(error);
      return;
    }

    resolve(result);
  });
  });
};
```

To finalize the upload endpoint we need to consume the created functions in order to so that when we trigger the endpoint the images will be converted to video and uploaded to cloudinary as highlighted in the `try catch` block below :

```try_catch
try {
    const output = await handleConvert(
      imagesToConvert,
      './phones.mp3',
      'repository/videos/slider.mp4'
    );
    console.error('Video created in:', output);
    const uploadApiResponse = await handleVideoUpload(output);
    console.log(uploadApiResponse);
    console.log(uploadApiResponse.url);
    return res.status(200).json({
      uploadApiResponse,
    });
  } catch (error) {
    console.error(error);
    console.error('Error:', err);
    console.error('ffmpeg stderr:', stderr);
   return res.status(400).json({
     error
   })

  }
```

## **Fetching Uploaded Videos From Cloudinary**

Once the videos have been uploaded to cloudinary we need to create an endpoint that will enable us fetch the videos and display them on the frontend. In the pages api directory create a `sliderVideos.js` file.

To fetch videos from Cloudinary we first need to initialize and configure its dependencies.

```cloudinary_config
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
```

Then we need to create an asynchronous request to cloudinary to fetch all the videos uploaded. Since we need to fetch only videos we shall declare a `resource_type` of videos and a a `prefix` of slidervideos to fetch only videos in the slidervideos folder as declared when creating my upload preset:

```fetch_images
export default async (req, res) => {
  await cloudinary.api
    .resources(
      { resource_type: 'video', type: 'upload', prefix: 'slidervideos' },
      function (error, result) {
        if (result) {
          res.status(200).json(result);
        }
        if (error) {
          console.error(error);
          res.status(404).json(error);
        }
      }
    )
    .catch((e) => {
      console.error(e);
    });
};
```

## **Video Display Component**

To showcase the uploaded videos on our frontend, navigate to the index.js file found inside the pages directory.
We shall leverage on the package `cloudinary-react` to display all the fetched videos from cloudinary hence having to initialize the package at the top of the component.

```imports
import { Video} from 'cloudinary-react';
```

The next step is to fetch videos from the created API endpoint, We shall leverage on Next.js `getStaticProps`. This will enable us to pre-render this page at build time and cache the uploaded video data returned from the API.

```getStaticProps
export async function getStaticProps(context) {
  const res = await fetch(`${API_URL}/api/sliderVideos`);
  const productShowcase = await res.json();
  if (!productShowcase) {
    return {
      notFound: true,
    };
  }
  return {
    props: { productShowcase },
  };
}
```

Once the videos data is fetched we will pass it to our component through props to display all the fetched data to our users.

Once the data is fetched through `props` we shall map over the received videos data and display them to our frontend using the `Video` component from the `cloudinary-react` library as illustrated below.

```
export default function VideoSlider({ productShowcase }) {
  return (
    <Layout>
      <h1> Convert Product Images into a video slideshow </h1>
      {productShowcase.length === 0 && <h3>No videos to Showcase</h3>}

      {productShowcase !== undefined &&
        productShowcase.resources.map((video) => (
          <Video
            key={video.public_id}
            publicId={video.public_id}
            cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD}
            secure='true'
            controls
            fallbackContent='Your browser does not support HTML5 video tags.'
            format='webm'
          ></Video>
        ))}
    </Layout>
  );
}
```

With all the above done, You should be able to convert images to video slides as seen in the codesandbox above.

## **Conclusion**

In this post, We learned how to create video slides from images using the videoshow npm package, cloudinary for storage and the FFmpeg package to convert and stream images to a video slideshow.

Here are some additional resources that can be helpful:

- [FFmpeg](https://www.ffmpeg.org/)
- [Cloudinary Training](https://training.cloudinary.com/)
- [Next.js Documentation](https://nextjs.org/docs)
