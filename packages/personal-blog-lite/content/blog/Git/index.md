---
title: Gitting Started
date: '2021-03-05'
description: Understanding Git And Github.
tags: ['Git', 'Github', 'Introduction']
cover: './git.png'
slug: 'gitting-started'
---

# **Introduction**

To many beginners getting into software development, tooling can be a very difficult process to understand. You tend to get confused when you get to hear someone mention “GIT” and at the same time “GITHUB”.Well not anymore!!!
I am going to try as much as possible to explain to you the difference between the two terminologies and their applications in the software development lifecycle.

This guide aims to give you a grasp and understanding of the basic terminologies and commands you’ll frequently use in your day to day activities as a software developer.

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
