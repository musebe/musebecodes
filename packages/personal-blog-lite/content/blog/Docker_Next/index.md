---
title: 'Getting Started With Docker & Next.Js'
date: '2021-04-12'
description: 'Docker Next.Js up and running'
tags: ['Next.js', 'Docker', 'Introduction']
cover: './Banner.png'
slug: 'docker_next'
---

Docker is a containerization tool used to speed up the development and deployment processes of applications. It also helps to eliminate environment-specific bugs since you can replicate your production environment locally.

We'll look at how to use Docker to build a production version of our Next.js application as a Docker image in this article. We'll also set up Docker to run this image locally in a container.

### **Project Setup**

- Generate a new app:

```npx
npx create-next-app -e with-docker docker
```

The above command will spin up a [Next.js](https://nextjs.org) application on your current directory docker folder configured with a setup multi-stage Dockerfile.

On the Dockerfile, we have different stages put together to produce a minimized production build image.

In the first stage, A linux alpine distribution is used to install the project dependencies by copying over the package.json file into the working directory, run `yarn install` to install the dependencies.Also, freeze the lockfile as highlighted below :

```stage1
# Install dependencies only when needed
FROM node:alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
```

On the second stage of the build, we are only going to rebuild the image only when needed.At this stage, we mainly copy over the application together with its dependencies and build it as illustrated :

```stage2

# Rebuild the source code only when needed
FROM node:alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN yarn build
```

In the last step of the production build which is named runner, We go into the app directory and tell it its a production build, copy over the needed files, Add users and security groups to the build, expose the application running port and finally give the Docker file a command to start your application :

```Final_build
# Rebuild the source code only when needed
FROM node:alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN yarn build

# Production image, copy all the files and run next
FROM node:alpine AS runner
WORKDIR /app

ENV NODE_ENV production

# You only need to copy next.config.js if you are NOT using the default configuration
# COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
RUN chown -R nextjs:nodejs /app/.next
USER nextjs

EXPOSE 3000

CMD ["yarn", "start"]

```

To test the application we shall first build and tag it by using the command:

```docker_build
docker build -t next-docker .
```

Once the application is build you can first start it by running :

```start_command
docker run -p 3000:3000 next-docker
```

### **Conclusion**

The Next.Js team has really put in a lot of efforts to make development of applications easier and faster. Is there any way better than this to setup a dockerized application ?

Hopefully this article saves your time to understand the setup process. 👋🏽👋🏽
