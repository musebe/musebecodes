---
title: 'Aircloud'
date: '2021-02-24'
description: Serverless Image Storage & Manipulation Using React, Cloudinary,    Airtable & Netlify functions.
tags:
  [
    'Database',
    'cloudinary',
    'storage',
    'airtable',
    'severless',
    'Netlify_functions',
  ]
cover: './air.png'
slug: 'aircloud'
---

# <b>BACKGROUND</b>

The adoption and use of severless frameworks in recent times has given frontend developers superpowers to build full-stack applications without having to manage and operate the entire application infrastructure.</br>
This has also freed developers from the worry of backend tasks like scaling servers and provisioning capacity and resources.

In this articles we shall be looking at how we can leverage Netlify
Functions(A severless framework ) to connect Cloudinary and Airtable in order to perform image manipulation,transformation and storage of images.

<iframe src="https://codesandbox.io/embed/aircloud-el3wv?fontsize=14&hidenavigation=1&theme=dark"style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" title="aircloud"allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"></iframe>

## Prerequisites

This is a beginner friendly tutorial.However some basic knowledge JavaScript is required.

You will need [Node.js](https://nodejs.org/en/) and [Netlify CLI](https://docs.netlify.com/cli/get-started/) as the core dev dependencies for this project

[Cloudinary](https://cloudinary.com/), [Airtable](https://airtable.com/) and [Netlify](https://www.netlify.com) are the platforms we shall leveraging on to deploy,store and manipulate assets(images).

## Cloudinary setup

If you don't have a Cloudinary account yet, you can [sign up](https://cloudinary.com/signup) for a free account. After verification of the account through an email sent to your registered email address, you can now login into your account to access the the required credentials.

From the dashboard, note down your `cloud_name, api_key, api_secret`. We shall be using them in the application.

The next step is to create a folder where all the application images will be stored. Click on the Media library tab and create a folder, name it `aircloud` .

A great way to manipulate assets(images) as we upload them to Cloudinary is by use of upload presets. This will enable one to pass one or more upload parameters defined in the cloudinary documentation. In this application we shall create an upload preset to resize images.

To do this, click on the settings icon on the navigation bar of your Cloudinary dashboard, scroll down to the upload presets section and click on the `Add upload preset` link. Give your preset a <b>`name`</b>, make the signing mode <b>`Signed`</b> as we shall want the parameters declared with the requests we make to be considered first. Under the <b>`Folder`</b> form please input the name of the folder you would want your application images to be stored. In our case we named the folder `aircloud`. Click on the save button and our setup will be complete.

## Airtable setup

Airtable is an easy-to-use online platform for creating and sharing relational databases. This is where we shall store the deployed images IDs and Urls in order to access them on our application. After creating an account on the platform, you’ll need to have a base i.e. a table/ sheet set up before you can start to programmatically manipulate the database.

You shall need the `apiKey`, `base id` and `table name` in order to programmatically access the base(database) from the application.
Upon creating the table and getting the credentials you table structure should follow the structure below.

 <iframe class="airtable-embed" src="https://airtable.com/embed/shr3pOyZrmmHZPwEy?backgroundColor=purple&viewControls=on" frameborder="0" onmousewheel="" width="100%" height="533" style="background: transparent; border: 1px solid #ccc;"></iframe>

A detailed step by step introduction can be found [Here](https://musebecodes.dev/airtable)

With all the platforms above setup we can start now start to code the application

## REACT SETUP

To get started with Create React App, you can simply navigate to the project directory of your choice and run the command in the root of your project folder:

```js
npx create-react-app aircloud
```

After the installation is finished, we will have a React app placed in the folder aircloud.

The first step with our React app is to set up all the individual routes for our application. These will be placed in the App.js component and correspond with the routes that YouTube has for their app:
