---
title: 'Automatic Poster Generator With Next.js & Faunadb'
date: '2021-05-17'
description: 'An events poster generator with cloudinary & faunadb.'
tags: ['next.js', 'storage', 'cloudinary', 'faunadb']
cover: './poster.png'
slug: 'poster-generator'
---

As an event organizer, one of the most important tools to marketing your planned event is a poster displaying all the relevant information about the event to your target audience.
In this article, we'll create an events poster generator to streamline the process and save time.
We'll use [Cloudinary](https://cloudinary.com) and [Next.js](https://nextjs.org) to create event posters automatically and store the manipulated image URLs in the [Faunadb](https://fauna.com/) database as illustrated in the [codesandbox](https://codesandbox.io/s/postergenerator-q5xhr?file=/components/Upload.js) below:

<iframe src="https://codesandbox.io/embed/postergenerator-q5xhr?fontsize=14&hidenavigation=1&theme=dark"style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"title="poster_generator" allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"></iframe>

### **PROJECT SETUP**

We need Node.js, and its package manager, npm, for this project. To check if we have them installed on our system, we run the following command:

```nodejs
node -v && npm -v
```

To create a Next.js app, open your terminal, cd into the directory you’d like to create the app in, and run the following command:

```next.js
npx create-next-app poster-generator
```

You now have a new directory called poster-generator. Let’s cd into it and run the following command to spin it up :

```start-command
npm run dev
```

### **CLOUDINARY SETUP**

To upload and fetch images to and from [Cloudinary](https://cloudinary.com), we need to first [create an account](https://cloudinary.com/users/register/free). Cloudinary offers a free tier with enough resources to get you started with media manipulation and optimization.

After creating an account you will need to :

- Obtain your `API KEY` and `SECRET` from the dashboard.

- Under the Media Library tab, create a folder where all the posters will be stored and give it a name of your choice.

### **FAUNA SETUP**

[Fauna](https://fauna.com/) is a cloud-based transactional serverless database that makes that data available via a data API. This makes it ideal for use in a Jamstack application.

There are multiple ways to get started with fauna databases. You can use the web-based dashboard to create and manage new databases. However, you can also do most actions via the Fauna Shell. For this article, we shall manage the database through the shell. This can only be accomplished if you have created a [Fauna account](https://dashboard.fauna.com/accounts/register).

If you signed up using third-party authentication like Netlify or GitHub, you need to create the database via the web dashboard and get a security key from the security tab of the database.

> Remember to store this key as we shall use it in the application to access the database.

The next step after creating an account is to login via the shell

```fauna-login
fauna cloud-login
```

At this point, one can create a database that will be used to store our transformed images. The database name shall be `poster_generator` :

```create_database
fauna create-database poster_generator
```

Once the database is created the next step is to create a collection where all the transformed image URLs will be stored. The name of the collection will be `transformations`:

```collection
CreateCollection({ name: "transformations" })
```

Finally, We need to create an index for this collection. The index will make it easier to locate a document.

```CreateIndex
CreateIndex({
  name: "transformed_images",
  source: Collection("transformations"),
  terms: [{ field: ["data", "url"]]
})
```

Our database is now ready to be used by the Next.js application after all of the above has been completed.

### **Additional Packages Installation**

To interact with cloudinary and faunadb within the application, run the following command to install the cloudinary and faunadb package managers :

```packages
npm i --save cloudinary faunadb
```

### **ENVIRONMENT VARIABLES**

Create a.env.local file in your root project structure. Then go to your Cloudinary and Fauna dashboards and fill in the values for each of the following keys :

```env
NEXT_PUBLIC_CLOUDINARY_CLOUDNAME=
NEXT_PUBLIC_CLOUDINARY_API_KEY=
NEXT_PUBLIC_CLOUDINARY_API_SECRET=
NEXT_PUBLIC_FAUNADB_SECRET_KEY=
```

### **UPLOAD COMPONENT**

Create a `Components` folder in the root project structure and add a `Uploads.js` file to it. This is where all the project components will be stored.

To the `Uploads` file create a functional component and import `useState` to it. This will help us listen to any change that happens within the component and update its state

Then declare the initial value of the state as `selectedFile` and `setSelectedFile` file function that will be used to update the state as shown below :

```state
const [selectedFile, setSelectedFile] = useState();
```

The next step is to create a function that will handle any changes to the file and update its state:

```handlefilechange
 const handleFileChange = (e) => {
    const file = e.target.files[0];
    previewFile(file);
    setSelectedFile(file);
    setFileInputState(e.target.value);
 };
```

Once the state of the component is updated with the correct data the next step is to create a function that will submit the data to Cloudinary.

```handlesubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onloadend = () => {
      uploadImage(reader.result);
    };
    reader.onerror = () => {
      setErrMsg('something went wrong!');
    };
  };

```

Then create a helper function that will make a post request and return a response based on the status of the upload when used in the `handlesubmit` function as illustrated below :

```
const uploadImage = async (base64EncodedImage) => {
    try {
      await fetch('/api/posters/upload', {
        method: 'POST',
        body: JSON.stringify({ data: base64EncodedImage }),
        headers: { 'Content-Type': 'application/json' },
      });
      setFileInputState('');
      imageUploaded();
      setSuccessMsg('Image uploaded successfully');
    } catch (err) {
      console.error(err);
      setErrMsg('Something went wrong!');
    }
  };
```

To complete the upload component, we'll need to create an upload form to select and submit files:

```Uploadform
<form onSubmit={handleSubmit}>
    <div className={styles.file}>
        <input type='file' onChange={handleFileChange} />
    </div>
    <input type='submit' value='Upload' className='btn' />
</form>
```

### **UPLOAD API**

To begin uploading and retrieving images from Cloudinary then storing the manipulated transformations to faunadb, create a `posters` folder inside the `pages` api directory and add a `upload.js` file to the directory.

Then create cloudinary and faunadb instances and imports the file as displayed below:

```instance&imports
import cloudinary from 'cloudinary';
const faunadb = require('faunadb');

const secret = process.env.NEXT_PUBLIC_FAUNADB_SECRET_KEY;
const q = faunadb.query;
const client = new faunadb.Client({ secret });

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUDNAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});
```

The next step is getting the submitted file from the triggered request then uploading it to cloudinary for storage purposes. By using the cloudinary `uploader.upload` function, one can tag and assign other variables to the image.

```upload
export default async (req, res) => {
  if (req.method === 'POST') {
    try {
     const fileStr = req.body.data;
     const public_id = `${Date.now()}`;
     const uploadResponse = await cloudinary.v2.uploader.upload(fileStr, {
     tags: 'guest_speaker',
     resource_type: 'auto',
     public_id,
    });
 } catch (error) {
   res.status(500).json({ error});
    }
  }
};
```

### **IMAGE MANIPULATION**

Once the image has been uploaded. We need to perform transformations to it and add it to our events speaker deck(template) which will act as the underlay for this project. You can download the template from this link : [Download](https://res.cloudinary.com/hackit-africa/image/upload/v1620904718/events_underlay.png)

The transformation below is going to transform the uploaded image into a circular shape and append the speakers' name below it then place it on top of the underlay image which acts as an events template.

```transformation
 const cloudinaryTransforms = {
        transformation: [
          {
            overlay: public_id,
            width: 250,
            height: 250,
            radius: 250,
            x: -450,
            y: -57,
          },
          {
            overlay: {
              text: 'Speakers Name',
              font_family: 'Arial',
              font_size: 24,
            },
            x: -450,
            y: 100,
            effect: 'colorize',
            color: '#fff',
          },
        ],
      };
```

The last piece of the puzzle is to utilize the transformation above on the image uploaded and append it to the underlay image to get the final transformed image url :

```transform image
   const transformedImg = await cloudinary.url(
     'events_underlay.png',
      cloudinaryTransforms
   );
```

### **MANIPULATED IMAGE STORAGE**

Once the image has been stored and transformed, cloudinary will return a url that contains the final transformed image that needs to be stored to Faunadb.

In order save a the transformed url collection to faunadb we shall leverage on the following query:

```storage
  client
    .query(
       q.Create(q.Collection('transformations'), {
         data: {
           url: transformedImg,
      },
   })
 )
  .then((ret) => console.log(ret));
```

### **FETCH IMAGES FROM FAUNADB**

To fetch data from Fauna we need to create an API endpoint inside the `pages` folder. Inside the `api` directory, create a folder and name it `getTransformations`, then create an index.js file. This is where all the fauna query codebase will be written.

The next step is to import the faunadb library we installed.

```import
const faunadb = require('faunadb');
```

Then create an instance of the `query` object from the Fauna Javascript driver :

```fauna instance

const secret = process.env.NEXT_PUBLIC_FAUNADB_SECRET_KEY;
const q = faunadb.query;
const client = new faunadb.Client({ secret });
```

With the above set, We are ready to start querying the uploaded URLs from Faunadb.

Reading data from Fauna is relatively simple in terms of Fauna Query Language. We'll use the `Map()` function to iterate over the data returned from the database. The `Paginate` function will be used to return data in small chunks while the `Match` function will find the search term in the requested index as illustrated below.

```fetch
module.exports = async (req, res) => {
  try {
    const dbs = await client.query(
      q.Map(
        q.Paginate(
          q.Match(
            q.Index('transformations')
          )
        ),
        (ref) => q.Get(ref)
      )
    );
    res.status(200).json(dbs.data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

```

### **Image Display Component**

At this point, we have transformed and stored all the images to faunadb. The next step is to create a component that will hold each image on the main page. Inside the components, folder create a `PosterItem` file and add the following to it.

```
import Image from 'next/image';
export default function EventItem({ poster }) {
  return (
    <div className={styles.event}>
      <div className={styles.img}>
        <Image
          src={poster.data.url ? poster.data.url : '/images/event-default.png'}
          width={900}
          height={500}
        />
      </div>
    </div>
  );
}

```

On the component, we use the Next.js image component to optimize all the transformed images.

To display all the images. Inside the pages folder on the `Index.js` file create a functional component.

At the bottom of the file, we shall fetch data from the database using Next's data pre-rendering technique `getStaticProps` which will enable us to fetch data from the database at build time.

```
export async function getStaticProps() {
  const res = await fetch(`${API_URL}/api/getTransformations`);
  const posters = await res.json();
  return {
    props: { posters: posters.slice(0, 10) },
    revalidate: 1,
  };
}

```

To ensure we fetch all the latest data we used the incremental static regeneration feature to revalidate the data after every 1 minute.

We pass the data to the component as props to display all of the images in our return function. This is accomplished by:

```
export default function HomePage({ posters }) {
  return (
    <div>
      <Layout>
        <h1>Upcoming Events Posters</h1>

        {posters.length === 0 && <h3>No Event Posters Created</h3>}

        {posters.map((poster) => (
          <EventItem key={poster.ts} poster={poster} />
        ))}
        {posters.length > 0 && (
          <Link href='/posters'>
            <a className='btn-secondary'>View All Event Posters</a>
          </Link>
        )}
      </Layout>
    </div>
  );
}
```

With all the above done. You should be able to upload, transform and display transformed images as shown in the codesandbox above :

### **Conclusion**

In this article, we learned how to leverage Next.js, Faunadb, and Cloudinary's massive capabilities such as storage and transformations to create an event poster. With the same capabilities, one can create way more powerful applications to serve their users.

### **Learn More**

- [Next's Documentation](https://nextjs.org/docs)
- [Digital Asset Management Training](https://training.cloudinary.com)
- [Fauna Documentation](https://docs.fauna.com/fauna/current/start/index.html)
