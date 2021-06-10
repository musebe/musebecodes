---
title: 'Video Streaming the Jamstack way'
date: '2021-04-07'
description: 'A Netflix clone using Cloudinary, Next.js and Airtables.'
tags: ['cloudinary', 'storage', 'airtable', 'video-api']
cover: './Jamflix.png'
---

## **BACKGROUND**

The popularity and use of video as a service (VAAS) platforms like Netflix, Tiktok, Snapchat, Instagram Live, among others have risen in recent years. In this case, marketing agencies and departments are making extensive use of these platforms to reach their target audiences via paid advertisements in order to generate sales.
In this MediaJam, We'll be building a Next.js video streaming service that makes use of Cloudinary's video and image APIs, as well as Airtable as a database as illustrated in the codesandbox below.

> **N/B** To Test video uploads, [Codesandbox](https://github.com/codesandbox/codesandbox-client/issues/759#ref-issue-318075056) and Vercel supports videos not more than 5 mega bytes. Hence uploading larger files will result to error code 413.

<iframe src="https://codesandbox.io/embed/jamflix-forked-9g4ny?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="JAMFLIX (forked)"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

### **PREREQUISITES**

To get started, A basic understanding of javascript and react is a required.

Ensure you have created a [Cloudinary](https://cloudinary.com/users/register/free) and [Airtable](https://airtable.com) accounts are they are the core platforms this project will be entirely relying on.

### **Environment Setup**

We shall be using [Next.js](https://nextjs.org/) an open source React framework to build the application.

Navigate to your projects directory and run :

```npx
npx create-next-app jamflix
```

After the installation is complete, follow the instructions on your terminal to start the development server.

### **Cloudinary setup**

After you've created a [Cloudinary](https://cloudinary.com/users/register/free) account, you'll need to:

- On your Cloudinary dashboard's navigation bar, click the settings icon.
- Scroll down to the upload presets section and click on the Add upload preset link.
- Give your preset a name and make the signing mode Unsigned.
- On the Folder form please input the name of the folder you would want your application images to be stored. In our case we named the folder Jamflix.
- Click on the save button and the setup will be complete.

### **Airtable**

We'll use [Airtable](https://airtable.com), an easy-to-use relational database, to store the uploaded and transformed images and videos. On the platform, create a base (database) with the following structure:

<iframe class="airtable-embed" src="https://airtable.com/embed/shrsA44aCgi5j8NV1?backgroundColor=pink" frameborder="0" onmousewheel="" width="100%" height="533" style="background: transparent; border: 1px solid #ccc;"></iframe>

### **Server setup**

To get the backend up and running. We'll need to add the Airtable and Cloudinary packages to the project, which we'll do with the following command:

```packages
npm i cloudinary airtable fs formidable swr
```

Create a`.env.local` file in your root project structure. Then go to your Cloudinary and Airtable dashboards and fill in the values for each of the following keys :

```.env.local
AIRTABLE_API_KEY=
AIRTABLE_BASE_ID=
AIRTABLE_TABLE_NAME=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_UPLOAD_PRESET=
```

Then create a `utils` folder in the root project structure of your application and add a `cloudinary.js` and `airtable.js` file in it to interact with the images stored in Cloudinary and Airtable from the application.

Cloudinary's image and video upload Api take the same structure with an exception of the parameters passed in the functions in order to manipulate the different media sources.

To begin uploading and retrieving images from Cloudinary, create a cloudinary access configuration in the utils folder of the cloudinary file:

```config
import cloudinary from 'cloudinary';
const fs = require('fs');
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
```

Then create functions to upload the video and its thumbnails as highlighted below :

```postTrailer
export async function postVideos(file) {
  const video = await cloudinary.v2.uploader.upload(file, {
    resource_type: 'video',
    upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
  });
  fs.unlinkSync(file)
  return video;
}
```

```postThumbnail
export async function postThumbnail(file) {
  const thumbnail = await cloudinary.v2.uploader.upload(file, {
    upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
  });
  fs.unlinkSync(file)

  return thumbnail;
}
```

To save storage space, once the thumbnail and video are uploaded to cloudinary, we use the fs.unlinkSync function to remove them from the application.

The next step is to save the generated callback of urls data and tags to Airtable once the thumbnail and video have been uploaded. Create a configuration and function in the airtable.js file to perform this operation, as shown below:

```airtable_config
import Airtable from 'airtable';

Airtable.configure({
  apiKey: process.env.AIRTABLE_API_KEY,
});

const base = Airtable.base(process.env.AIRTABLE_BASE_ID);
const table = base(process.env.AIRTABLE_TABLE_NAME);
```

To post the generated records to airtable, create the following function :

```upload.js
export async function postVideo(obj) {
  const { Imgid, Name, Tag, Videolink, Thumbnail } = obj;

  const record = await table.create({
    Imgid,
    Name,
    Tag,
    Videolink,
    Thumbnail,
  });

  return record;
}
```

In order to get all the uploaded records one can use the function :

```getrecords function
export async function getAllVideos() {
  const records = await table.select({}).firstPage();
  const formattedRecords = records
    .map((record) => ({
      id: record.id,
      ...record.fields,
    }))
    .filter((record) => !!record.Imgid);
  return formattedRecords;
}
```

Out of the box, Next.js allows you to write server-side code rendering. To accomplish this, go to the page's directory and create an api folder. Create a cloudinary.js file inside it and paste the following code:

```airtable.js

const { getAllVideos, postVideo } = require('../../utils/airtable');

async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const formattedRecords = await getAllVideos();
      res.status(200).json(formattedRecords);
    } catch (error) {
      res.status(500).json({ message: 'Failed fetching videos.' });
    }
  }
}

```

Above, we exported the airtable utility functions we created earlier and then created a `GET` method to pull all of the stored records in airtable.

Then create a `POST` method that will enable the records created to be stored to airtable :

```else
else if (req.method === 'POST') {
    try {

      const record = await postVideo(req.body);
      res.status(200).json(record);
    } catch (error) {
      res.status(500).json({ message: 'Failed posting video to airtable.' });
    }
  }
```

To finish the backend API, we'll need to create API routes in the pages folder that will allow us to upload videos and their thumbnails to Cloudinary, and then save the generated callbacks data in Airtable.

In the pages folder, create a `video.js` file, since we'll be using Formidable to upload the files (Media). We'll need to import it first, as well as the Cloudinary utilities.

Since we'll be using Formidable to upload the files (Media), we'll need to import it first, as well as the cloudinary utilities.

```imports
import { postVideos } from '../../utils/cloudinary';
import formidable from 'formidable';
```

Then write the POST method handler that follows.

```posthandler.js
async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const form = new formidable.IncomingForm();
      form.keepExtensions = true;
      form.parse(req, async (err, fields, files) => {
        const video = await postVideos(files['video'].path);
        res.status(200).json(video);
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
}
```

For thumbnails uploads create a `thumbnail.js` file in the api folder and emulate the content in the `video.js` file, only replace the postVideo imports and functions to `postThumbnail` as videos and thumbnails have different presets applied to them as displayed below :

```thumbnail
import {postThumbnail } from '../../utils/cloudinary';
```

### **Post Thumbnail & Video**

To begin uploading video trailers and thumbnails to Cloudinary and then storing the records created in Airtable, create a Components folder on the project's root project structure and an `UploadForm.js` file.

In the file create a functional component and import the useState function the add :

```state
const [file, setFile] = useState('');
```

This will be used to hold the image file path before initiating the post request to the thumbnail api we created before.

Add the following codeblock to the return statement, which will be used to consume the state variables declared above in the upload form.

```uploadform
<label>Cover photo</label>
<input
  type='file'
  className='custom-file-input'
  id='customFile'
  required
  onChange={(e) => {
    setFile(e.target.files[0]);
  }}
/>
```

To append the file stored in the state upon performing an upload we shall create a formData variable and attach the selected file to it as shown below:

```forrmdata
 const formData = new FormData();
 formData.append('cover_photo', file);
```

In order to upload videos to the video Api create add a useState variable that will hold the video to the state and set its values to :

```videoupload
const [file_2, setFile_2] = useState('');
```

Then emulate the thumbnail upload form code changing the onChange function to `setFile_2(e.target.files[0])`.

When a POST request is made after selecting a thumbnail and its videos, we will store the returned callback data in airtable by making the following post request:

```airtable_post
    axios.post('/api/airtable', {
      Imgid:res_2.data.asset_id,
      Name: name,
      Tag: tag,
      Videolink: res_2.data.url,
      Thumbnail: res.data.url,
    })
      .then(function (response) {
        console.log(response);
        window.location.reload(false);
     });
```

The movie name, category, video link url, and thumbnail url will all be sent to the airtable as a single movie object.

### **Display Video**

Create a functional `Movies.js` file in the pages folder and import useState, useEffect, and useSWR at the top to display the uploaded videos.

To fetch data from the Airtable, we'll use the `Swr` hook to cache previously fetched data, allowing the application to provide a better user experience by only fetching new data on page reload.

```swr
const { data, error } = useSWR('/api/airtable');
```

once the cached data is fetched we shall pass it down to the component by fetching it using the `useEffect` hook on page reload.

```useEffect
  useEffect(async () => {
    await setMovies(data);
  }, [data]);
```

We'll use next's lifecycle method getStaticProps to render the data to the users. We'll be able to generate all of the videos and thumbnails during the build process, allowing us to serve static data to the end-users.

The following codeblock will be used to accomplish this.

```getStaticProps
export async function getStaticProps() {
  const response = await fetch('/api/airtable');
  const data = await response.json();
  return { props: { movies: data } };
}
```

Map through the received data and display the returned parameters as shown below to display the fetched data:

```map
movies.map((movie, id) => {
  return (
      <div
        key={id}
        className='Item'
         onClick={() => {
            setVideoUrl(movie.Videolink);
         }}
         style={{
         backgroundImage: `url(` + movie.Thumbnail + `)`,
         margin: 5,
         }}
         >
         <div className='overlay'>
           <div className='title'>{movie.Name}</div>
           <div className='rating'>{movie.Tag}</div>
         </div>
      </div>
      );
  })}
```

### **Conclusion**

With the above MVP, more features such as automatic subtitles, video markers to help users navigate to a specific video section, and much more can be added using the cloudinary video API.

Visit the following website for further information::

[NEXT DOCUMENTATION](https://nextjs.org/docs)

[CLOUDINARY TRAINING](https://training.cloudinary.com)

[AIRTABLE API DOCUMENTATION](https://airtable.com/api/meta)
