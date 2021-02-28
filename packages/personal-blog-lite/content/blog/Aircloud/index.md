---
title: 'Aircloud'
date: '2021-03-01'
description: Serverless Image Storage & Manipulation Using React, Cloudinary,Airtable & Netlify functions.
tags:
  [
    'Database',
    'cloudinary',
    'storage',
    'airtable',
    'severless',
    'Netlify_functions',
  ]
cover: './aircloud.png'
slug: 'aircloud'
---

# **BACKGROUND**

The adoption and use of severless frameworks in recent times has given frontend developers superpowers to build full-stack applications without having to manage and operate the entire application infrastructure.</br>
This has also freed developers from the worry of implementing backend tasks like scaling servers, provisioning capacity and resources.

In this articles we shall be looking at how we can leverage Netlify
Functions(A severless framework ) to connect Cloudinary and Airtable in order to perform image manipulation,transformation and storage.

<iframe src="https://codesandbox.io/embed/aircloud-el3wv?fontsize=14&hidenavigation=1&theme=dark"style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" title="aircloud"allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"></iframe>

## **Prerequisites**

This is a beginner friendly tutorial.However some basic knowledge of JavaScript is required.

You will need [Node.js](https://nodejs.org/en/) and [Netlify CLI](https://docs.netlify.com/cli/get-started/) installed on your machine as they are the core dev dependencies of this project

[Cloudinary](https://cloudinary.com/), [Airtable](https://airtable.com/) and [Netlify](https://www.netlify.com) are the platforms we shall leveraging on to deploy,store and manipulate assets(images).

## **Cloudinary setup**

If you don't have a Cloudinary account yet, you can [sign up](https://cloudinary.com/signup) for a free account. After verification of the account through an email sent to your registered email address, you can now login into your account to access the the required credentials.

From the dashboard, note down your `cloud_name, api_key & api_secret`. We shall be using them in the application.

The next step is to create a folder where all the application images will be stored. Click on the Media library tab and create a folder, name it `aircloud` .

A great way to manipulate assets(images) as we upload them to Cloudinary is by use of upload presets. This will enable one to pass one or more upload parameters defined in the cloudinary documentation. In this application we shall create an upload preset to resize images.

To do this, click on the settings icon on the navigation bar of your Cloudinary dashboard, scroll down to the upload presets section and click on the `Add upload preset` link. Give your preset a <b>`name`</b>, make the signing mode <b>`Signed`</b> as we shall want the parameters declared with the requests we make to be considered first. On the <b>`Folder`</b> form please input the name of the folder you would want your application images to be stored. In our case we named the folder `aircloud`. Click on the save button and the setup will be complete.

## **Airtable setup**

Airtable is an easy-to-use online platform for creating and sharing relational databases. This is where we shall store the deployed images IDs and Urls in order to access them on our application. After creating an account on the platform, you’ll need to have a base(database) table/sheet set up before you can start to programmatically interact with the database.

You shall need the `apiKey`, `base id` and `table name` in order to programmatically access the base(database) from your application.
Upon creating the table and getting the credentials your table structure should look like :

 <iframe class="airtable-embed" src="https://airtable.com/embed/shr3pOyZrmmHZPwEy?backgroundColor=purple&viewControls=on" frameborder="0" onmousewheel="" width="100%" height="533" style="background: transparent; border: 1px solid #ccc;"></iframe>

A detailed step by step introduction to Airtable can be found [Here](https://musebecodes.dev/airtable)

With all the platforms above setup we can start now start to code the application

## **REACT SETUP**

To get started with Create React App, you can simply navigate to the project directory of your choice and run the command in the root of your project folder:

```js
npx create-react-app aircloud
```

After the installation is finished, we will have a React app placed in the folder aircloud.

The first step with our React app is to install the dependencies our application will use.

Run this command to install the required dependencies :

```js
npm i dotenv cloudinary-react cloudinary
```

As we had already setup the different platforms and acquired the credentials, create a `.env` file on the root of your folder and add the respective values :

```js
CLOUDINARY_CLOUD_NAME = xxxxx;
CLOUDINARY_API_KEY = xxxxxxx;
CLOUDINARY_API_SECRET = xxxxxxx;
CLOUDINARY_UPLOAD_PRESET = xxxxxxx;
AIRTABLE_API_KEY = xxxxxxxx;
AIRTABLE_BASE_ID = xxxxxxxxx;
AIRTABLE_TABLE_NAME = xxxxxxxx;
```

We shall be using Netlify functions, create a `netlify.toml` file on the root folder . This file will define how Netlify will build and deploy your site.

```netlify.toml
[build]
    functions="functions"
```

With all setup and configurations done, its time to spin up the server.Since we shall be leveraging on cloud functions,replace the default react start command `npm start` and use Netlify CLI to perform this operation. On your terminal run the following command :

```start
netlify dev
```

The application will have two major components that will be used to upload and display the images. Create a components folder inside the `src` directory of your react application and add `Upload.js` & `ImageGallery.js` files.

Navigate back to the `App.js` component and add the following code :

```App.js

import './App.css';
import Upload from './components/Upload';
import ImageGallery from './components/ImageGallery';
//  import Title from './components/Title';

function App() {
  return (
    <div className='container'>
      <Upload />
      <ImageGallery />
    </div>
  );
}

export default App;
```

When it comes to building the appearance of the application, we're going to be leveraging on `bootstrap` a Css library. Add the following CDN to your `index.html` file found inside the `public` directory :

```index.html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css" integrity="sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l" crossorigin="anonymous">
```

The next step is to create a functions folder in the root project directory as defined in the `netlify.toml` file. This will be the home to all our severless functions.

In order to interact with Airtable within our application without having to repeat the same code everytime in different files,create a utils folder where we shall put the airtable.js file.

This will enable us achieve the coding principle of `don't repeat yourself` by reusing the file anytime we need to make use of it.

Create an `airtable.js` file inside the utils folder and add the following to it.

```airtable.js
require('dotenv').config();
const Airtable = require('airtable');

Airtable.configure({
  apiKey: process.env.AIRTABLE_API_KEY,
});

const base = Airtable.base(process.env.AIRTABLE_BASE_ID);
const table = base(process.env.AIRTABLE_TABLE_NAME);

module.exports = {
  base,
  table,
};
```

From the code above, I imported the dotenv package in order to access the environment variables stored in the .env file. I then initialized and configured the Airtable library which enabled me to create and export variables that will enable one to access the base and table globally within the application.

### **Upload Files Component**

We can now build the `Upload.js` component that will enable us upload and store the images.

```Upload.js
import React, { useState } from 'react';

const Upload = () => {
  const [imageDataUrl, setImageDataUrl] = useState('');

  const handleChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImageDataUrl(reader.result);
    };
    reader.onerror = () => {
      console.log('error');
    };
  };

  return (
    <div>
    <form onSubmit={submitHandler}>
        <label>
          <input type='file' onChange={handleChange} />
          <span>+</span>
        </label>

        <button type='submit' className='button' disabled={!imageDataUrl}>
          {' '}
          Upload Image
        </button>
      </form>
      {imageDataUrl && (
       <img className="height-50 w-50" src={imageDataUrl} alt="aircloud_gallery" />
      )}
    </div>
    </div>
  );
};

export default Upload;

```

Using the useState hook in the component will enable us track changes when uploading images.
The handleChange function capture the first file selected, convert the file into a string and set the application state to have that Url by using `setImageDataUrl`
We then create a form inside the return statement that will utilize the `handleChange` function when triggered.

The last piece to make the component complete is to create a `submitHandler` which will be responsible for uploading files

```upload.js
 const submitHandler = async (e) => {
    e.preventDefault();
    console.log('submitting');
    try {
      const res = await fetch(
        deployed_function,
        {
          method: 'POST',
          body: imageDataUrl,
        }
      );

      const data = res.json();
      // console.log(data);
      setImageDataUrl('');
    } catch (err) {
      console.error(err);
    }
```

We used the preventDefault() method to prevent the upload button from submitting the form, after which we made a post request to the severless api endpoint we shall create to store the image to cloudinary.

## **File UPLOAD SEVERLESS FUNCTION**

Inside the functions folder, create an `upload.js` file that will hold all the upload logic and add the following:

```upload.js

require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const { table } = require('./utils/airtable');

exports.handler = async (event) => {
// Capture the file from the event body
  const file = event.body;

  try {
    // Upload the file captured to cloudinary
    const { public_id, secure_url } = await cloudinary.uploader.upload(file, {
      upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
    });

    console.log(public_id, secure_url);
// Save the secure_url and public id to Airtable
    const record = await table.create({
      imgId: public_id,
      url: secure_url,
      username: 'Musebecodes',
    });
    return {
      statusCode: 200,
      body: JSON.stringify(record),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ err: 'Failed to upload image' }),
    };
  }
};

```

From the code above, we bring in environment variables by using the `dotenv` module which is used to configure our access to Cloudinary. We also bring Airtable into the file for storage of the image parameters.

Then create an asynchronous handler function that listens to the event body and captures a file when an upload is initiated,this then takes the upload and stores it in Cloudinary inside the `aircloud` folder we earlier created. This is made possible by utilizing the upload preset.

After the upload to cloudinary, We store the `public_id` and `secure_url` given to us into Airtable by using the `table.create` function provided to us by Airtable.

## **Image Display**

To display the stored images, we first need to create a function that will `GET `all the data stored on the airtable database. This can be achieved by creating a creating a `getImages.js` file inside the functions folder and adding the following :

```.js
const { table } = require('./utils/airtable');

exports.handler = async (event) => {
  try {
    const records = await table.select({}).firstPage();
    const formattedRecords = records
      .map((record) => ({
        id: record.id,
        ...record.fields,
      }))
      .filter((record) => !!record.imgId);
    return {
      statusCode: 200,
      body: JSON.stringify(formattedRecords),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ err: 'Failed to upload image' }),
    };
  }
};

```

From the above code, we first import `table` from the utils folder in order to access airtable, fetched and formatted the json data returned.

With all the above done, Its time to display the uploaded images. Create an `imageGallery.js` component and add the following :

```imageGallery.js
import React, { useEffect, useState } from 'react';
import { Image, Transformation } from 'cloudinary-react';

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  // const local_function = 'http://localhost:58665/api/getImages';
  const deployed_function = 'https://aircloud.netlify.app/.netlify/functions/getImages';

  useEffect(() => {
    const loadImages = async () => {
      try {
        const res = await fetch(
          deployed_function
        );
        const data = await res.json();
        setImages(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    loadImages();
  }, []);

  return (
    <div className='image-gallery'>
      {images.length > 0 &&
        images.map((image) => (
          <div className='gallery-img' key={image.id}>
            <Image cloudName='hackit-africa' publicId={image.imgId}>
              <Transformation width='280' height='280' crop='fit' />
            </Image>
          </div>
        ))}
    </div>
  );
};

export default ImageGallery;
```

By using `useEffect` we are able to fetch all the stored images and display them to the user by using the [cloudinary-react](https://www.npmjs.com/package/cloudinary-react) library.which enabled us perform image resizing and cropping to attain uniformity on all the images uploaded.

## **Conclusion**

You have successfully built a severless application leveraging on Airtable, Cloudinary and Netlify functions. I hope you have enjoyed this tutorial. Feel free to share your thoughts.
