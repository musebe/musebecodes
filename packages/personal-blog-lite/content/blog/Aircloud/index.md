---
title: 'Aircloud'
date: '2021-03-01'
description: Serverless Image Storage & Manipulation Using React, Cloudinary,Airtable & Netlify functions.
tags: ['cloudinary', 'storage', 'airtable', 'severless']
cover: './aircloud.png'
slug: 'aircloud'
---

## **BACKGROUND**

The adoption and use of severless frameworks in recent times has given frontend developers superpowers to build full-stack applications without having to manage and operate the entire application infrastructure.
This has also freed developers from the worry of implementing backend tasks like scaling servers, provisioning capacity and resources.

In this article, you'll explore how you can leverage Netlify
Functions(A severless framework ) to connect Cloudinary and Airtable in order to perform image manipulation,transformation and storage.

The complete source code used in this tutorial is available on Codesandbox.

<iframe src="https://codesandbox.io/embed/aircloud-el3wv?fontsize=14&hidenavigation=1&theme=dark"style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" title="aircloud"allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"></iframe>

## **Prerequisites**

This is a beginner friendly tutorial.However some basic knowledge of JavaScript is required.

You will need [Node.js](https://nodejs.org/en/) and [Netlify CLI](https://docs.netlify.com/cli/get-started/) installed on your machine as they are the core dev dependencies of this project

[Cloudinary](https://cloudinary.com/), [Airtable](https://airtable.com/) and [Netlify](https://www.netlify.com) are the platforms we shall be leveraging on to deploy,store and manipulate assets(images).

## **Cloudinary setup**

If you don't have a Cloudinary account yet, you can [sign up](https://cloudinary.com/signup) for a free account.

After verification of the account through an email sent to your registered email address, you can login into your account to access the required credentials.

From the dashboard, note down your `cloud_name, api_key & api_secret` as we shall be using them in the application.

The next step is to create a folder where all the application images will be stored. Click on the Media library tab and create a folder, name it `aircloud` .

A great way to manipulate assets(images) as we upload them to Cloudinary is by use of upload presets. This will enable one to pass one or more upload parameters defined in the cloudinary documentation. In this application we shall create an upload preset to resize images. To do this;

- Click on the settings icon on the navigation bar of your Cloudinary dashboard,

- Scroll down to the upload presets section and click on the `Add upload preset` link.

- Give your preset a **`name`**, make the signing mode **`Signed`** as we shall want the parameters declared with the requests we make to be considered first.

- On the **`Folder`** form please input the name of the folder you would want your application images to be stored. In our case we named the folder `aircloud`.

- Click on the save button and the setup will be complete.

## **Airtable setup**

Airtable is an easy-to-use online platform for creating and sharing relational databases. This is where we shall store the deployed images IDs and Urls in order to access them on our application. After creating an account on the platform, you’ll need to have a base(database) table/sheet set up before you can start to programmatically interact with the database.

You shall need the `apiKey`, `base id` and `table name` in order to access the base(database) from your application.
Upon creating the table and getting the credentials your table structure should look like :

 <iframe class="airtable-embed" src="https://airtable.com/embed/shr3pOyZrmmHZPwEy?backgroundColor=purple&viewControls=on" frameborder="0" onmousewheel="" width="100%" height="533" style="background: transparent; border: 1px solid #ccc;"></iframe>

A detailed step by step introduction to Airtable can be found [Here](https://musebecodes.dev/airtable)

With all the platforms above setup we can now start to build the application

## **REACT SETUP**

To get started with Create React App;

#### **Step 1: Create React App**

Navigate to the project directory of your choice and run :

```js
npx create-react-app aircloud
```

After the installation is done, you will have a React application placed in the folder aircloud.

#### **Step 2: Install project dependencies**

Install the required dependencies the application will use by running the command below:

```js
npm i dotenv cloudinary-react cloudinary
```

When it comes to structuring the appearance of the application, we're going to be leveraging on `bootstrap` a Css library.
Add the following CDN to your `index.html` file found inside the `public` directory :

```index.html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css" integrity="sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l" crossorigin="anonymous">
```

#### **Step 3: Configure environment variables**

Having setup the different platforms and acquired the credentials, create a .env file on the root of your folder and add the respective values :

```js
CLOUDINARY_CLOUD_NAME = xxxxx;
CLOUDINARY_API_KEY = xxxxxxx;
CLOUDINARY_API_SECRET = xxxxxxx;
CLOUDINARY_UPLOAD_PRESET = xxxxxxx;
AIRTABLE_API_KEY = xxxxxxxx;
AIRTABLE_BASE_ID = xxxxxxxxx;
AIRTABLE_TABLE_NAME = xxxxxxxx;
```

#### **Step 4: Set up Netlify functions**

To use the Netlify functions to manage the application, create a `netlify.toml` file on the root project folder and paste the code below:

```netlify.toml
[build]
    functions="functions"
```

This file will define how Netlify will build and deploy your site. All the serverless functions shall be stored in the functions folder.

Now create a functions folder in the root project directory as defined in the `netlify.toml` file; this will be the home to all our severless functions.

In order to interact with Airtable within our application without having to repeat the same code everytime in different files, create a utils folder inside the functions folder and add an `airtable.js` file.

Paste the following in it:

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

This will enable us achieve the coding principle of `don't repeat yourself` by reusing the file anytime we need to make use of it.

From the code above, I imported the dotenv package in order to access the environment variables stored in the .env file. I then initialized and configured the Airtable library which enabled me to create and export variables that enables one to access the base and table globally within the application.

With all the above setup and configurations, its time to spin up the server. Since we shall be leveraging on cloud functions,replace the default react start command `npm start` and use Netlify CLI to perform this operation. On your terminal run the following command :

```start
netlify dev
```

#### **Step 5: Create the upload and image display components**

The application will have two major components that will be used to upload and display the images. To enable this, create a `components` folder inside the `src` directory of your react application and add an `Upload.js` & `ImageGallery.js` files.

Now navigate back to the `App.js` component and paste the following code :

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

### **Upload Files Component**

We can now build the `Upload.js` component that will allow the upload and storage of images.

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

Using the useState hook in the component will enable you track changes when uploading images.
The handleChange function capture the first file selected, converts the file into a string and sets the application state to have that Url by using `setImageDataUrl`
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

The preventDefault() method is used to prevent the upload button from submitting the form, after which we made a post request to the severless api endpoint that we shall create to store the image to cloudinary and the url to airtable.

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

As a result of the preceding, we bring in environment variables by using the `dotenv` module which is used to configure access to Cloudinary. We also bring Airtable into the file for storage of the image parameters.

Then we created an asynchronous handler function that listens to the event body and captures a file when an upload is initiated,this then takes the upload and stores it in Cloudinary inside the `aircloud` folder we earlier created. This is made possible by utilizing the upload preset.

After the upload to Cloudinary, We store the `public_id` and `secure_url` given to us into Airtable by using the `table.create` method.

## **Image Display**

To display the stored images, we first need to create a severless function that will `GET `all the data stored on the Airtable database. This can be achieved by creating a creating a `getImages.js` file inside the functions folder and adding the following :

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

With all the above done, Its time to display the uploaded images. Create an `imageGallery.js` component and include the following :

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

By using `useEffect` we have the ability to fetch all the stored images and display them to the user by using the [cloudinary-react](https://www.npmjs.com/package/cloudinary-react) library.which enables us perform image resizing and cropping to attain uniformity on all the images uploaded.

## **Conclusion**

You have successfully built a severless application leveraging on Airtable, Cloudinary and Netlify functions. I hope you have enjoyed this tutorial. Feel free to share your thoughts.

For more information visit:

- [Digital Asset Management Training](https://training.cloudinary.com)
- [Introduction to Airtable](https://musebecodes.dev/airtable)
- [Getting Started with Netlify Functions](https://dev.to/ekafyi/getting-started-with-netlify-functions-part-1-zero-config-setup-and-writing-our-first-functions-1i5b)
