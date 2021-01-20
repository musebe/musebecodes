# How to Configure / How to Install \*\*

After downloading the file from ThemeForest, You will find StoryHub.zip file.Then unzip

StoryHub.zip file and run the following commands. We have 8 different Blog demos. They are

1. Agency Blog
2. Agency Blog Modern
3. Beauty Blog
4. Personal Blog
5. Personal Blog Minimal
6. Personal Blog Lite
7. Image Blog
8. Photography Blog Minimal

**If you want to run Agency Blog on Gatsby Js server , then**

1. yarn on StoryHub folder.

2) yarn dev:agency on StoryHub folder.

Then , please go to address localhost:8000 on your browser and You will find Agency blog. Similarly ,

**If you want to run Personal Blog on Gatsby Js server , then**

1. yarn on StoryHub folder.

2) yarn dev:personal on StoryHub folder.

Then , please go to address localhost:8000 on your browser and You will find personal blog.

**If you want to run Personal Blog Minimal on Gatsby Js server , then**

1. yarn on StoryHub folder.

2) yarn dev:personal-minimal on StoryHub folder.

Then , please go to address localhost:8000 on your browser and You will find personal blog minimal demo.

NOTE: Other packages will follow same conventions (please see package.json for more info)

**Stack We Used**

1. Lerna (A tool for managing JavaScript projects with multiple packages. https://lernajs.io)

2. Yarn Workspace.

3. React Js .

4. Typescript.

5. Gatsby Js.

6. GraphQl .

7. Styled System and Styled Components

**Folder Structure**

Go to StoryHub - > packages folder .

After entering to packages folder, You will find some other folders.

1. agency-blog
2. agency-blog-modern
3. beauty-blog
4. personal-blog
5. personal-blog-lite
6. personal-blog-minimal
7. image-blog
8. photography-blog-minimal

**agency-blog, personal-blog, personal-blog-minimal, image-blog, photography-blog-minimal**

The main Gatsby Structure are done in these folder. Each folder(agency-blog/personal-blog/ personal-blog-minimal) is a separate gatsby project. For details, You can follow the gatsby doc (https://www.gatsbyjs.org/docs/)

**agency-blog**

You will find the main gatsby structure in this folder. We will discuss the main folder structure and their usage.

**content**

In Content folder you will find two folder. ‘assets’ and ‘blog’

1.assets

You will find all the assets like images, videos in this folder.

2. Blog

You will find blog posts in this folder. Each folder like(installing-Multiple-Versions,

art-of-perception) is a single post. You will find an `index.md` file in each folder. In this

`index.md` file, you can write your post(We have a detailed section about how to write a post). You can keep your images related in your post in this folder.

**src**

Inside the ’src’ folder, you will find some folders like components, containers, images, pages, templates, theme.

Components
In the src->component folder, you will find the component which is needed only for this agency-blog template. All the codes are written in Typescript Containers.

In the src->containers folder, we have written all of our codes part by part. You will also find the style.js file . All the codes are written in Typescript.

Pages

In the src->pages folder, you will find the routes of all of the pages used in this template like index.tsx , 404.tsx etc.

Templates

All the page templates are written in this fold

Theme

colors.tsx : in this file, you can keep all of the custom colors for your specific landing pages. customeVariant.tsx : For writing custom variants. index.tsx : all of the style props.

We have used styled system for this folder structure (https://github.com/jxnblk/styled-system ) . You can also follow this article for clearing your concept https://varun.ca/styled-system/.

The other templates like personal-blog, personal-blog-minimal are built with same structures.

How to write a blog post

To write a blog post, please go to packages -> (agency-blog/personal-blog/

personal-blog-minimal) -> content -> blog folder and create a folder with a name

like(art-of-perfection) . Then create a md file named index.md and then write your post in this format

---

title: Sharing content that makes other people engage date: '2019-01-01T23:46:37.121Z'

cover: './preview.png'
tags: ['markdown', 'test', 'unity']

slug: 'sharing-content-that-makes-other'

---

(Post details Start)Technology companies can do more, but as long as these trends continue, there will be incentives for companies to exploit them for profit. Both technology companies and libraries need to recognize that a core aspect of the problem is social in nature. The most obvious tool that libraries have at their disposal is the promotion of information literacy.(Post details End).

Instagram Token

To add instagram token, please go to packages -> (agency-blog/personal-blog/

personal-blog-minimal) -> gatsby-config.js-> go to 'resolve:gatsby-source-instagram' and put your instagram username,access,id token there. For further info, please check this link https://www.gatsbyjs.org/packages/gatsby-source-instagram

Disqus Name

To add Disqus token, please go to packages -> (agency-blog/personal-blog/

personal-blog-minimal) -> env.development and packages -> (agency-blog/personal-blog/

personal-blog-minimal) env.production and put your Disqus name there.

Mailchimp Integration

To add mailchimp integration, please go to packages -> (agency-blog/personal-blog/ personal-blog-minimal) -> gatsby-config.js-> go to 'resolve:gatsby-plugin-mailchimp' and put your endpoint there. For further info, please check this link https://www.gatsbyjs.org/packages/gatsby-plugin-mailchimp

## Deployment

It's a pure Gatsby Markdown Project so could host any of those supported provider
https://www.gatsbyjs.org/docs/deploying-and-hosting/
