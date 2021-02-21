---
title: 'Introduction to Airtables'
date: '2021-02-24'
description: An introduction to Airtable as a database.
tags: ['Database', 'introduction', 'storage', 'airtable']
cover: './air.png'
slug: 'airtable'
---

# <b>BACKGROUND</b>

In my day to day interaction with programming projects, most of my clients specify that some part of their data should be stored on an excel sheet as part of their data backup and warehousing strategy. This process takes most of my time as i have to interact with two or more data sources as per the scope of the given project.<br/>
As I did my research, I came across this awesome platform [AIRTABLE](https://airtable.com/), which could have made my work easier from the work go by providing me with a data storage facility, an API endpoint to interact with my data programmatically and a beautiful well presented UI interface that my clients could interact with their records.

In this tutorial, I will be showing you how you can perform <b>CRUD</b> operations to your data on the Airtable platform.

Please use my referral link as a token of appreciation for my effort. [LINK](https://airtable.com/invite/r/ATsRy46j)

## <b>What is Airtable</b>

Airtable is an easy-to-use online platform for creating and sharing relational databases. The user interface is simple, colorful, friendly, and allows anyone to spin up a database in minutes. You can store, organize, and collaborate on information about anything <br/>

In this article, We will explore on how to manipulate a base(Airtable's word for a database) through its simple REST API to perform the basic CRUD (Create, Read, Update, and Delete) operations on the data stored.

## <b>AIRTABLE'S KEY CONCEPTS</b>

- <b>A Base</b>: A base is a database that contains all of the information you need for a specific project, and is made up of one or more tables. <br/>
  Bases are made up of one or more tables, which are essentially like different sheets or tabs of a spreadsheet.

- <b>A Table</b>: This is one set of data, organized in columns

- <b>A View </b>: This is a particular representation of a table. You can have the same data presented in different views.

## <b>Getting Started</b>

After creating an Airtable account, you will be presented with a list of sample bases(Databases) that you can use to quickstart a new project. You can also start from scratch by selecting a workspace, and clicking the Add a base or create a base button as displayed in the image below.

![](intro.png)

Incase you have existing data in a spreadsheet, you can also import the data to airtable.

## <b>Authentication</b>

Airtable comes with a simple REST API to perform the basic CRUD operations on the data stored. You'll need to have a base i.e. a table/ sheet set up before you can start to programmatically manipulate the database.

After creating your table/sheet structure, you will need to get an **API Key** for verification purposes when accessing the base(Database) programmatically. This can be accessed by clicking the account link that is found under the user icon image as displayed below.

![](icon.png)

After clicking the icon, you will be redirected to your account's settings page where you will find your API key as shown below. Copy the key and store it in a safe place as we shall use it in the coming steps.

> Do not share your KEYS with anyone. Incase they get exposed, kindly delete and regenerate new API keys.

![](account.png)

The last thing we need to do before we can interact with our base programmatically is to create a table that we can manipulate from our codebase.
The name of our table will be <em>Users</em> and the properties inside the table will be <b>Name</b> - Long Text, <b>Email - Email</b> and <b>Country - Single line text</b> as displayed below.

![](structure.png)

😀 <em>Talk is cheap, show me the code</em> 😀

## APPLICATION CODEBASE SETUP

A basic Node application contains a <b>.js</b> file and a <b>package.json</b> file. which is used to list your project dependencies and start scripts.

To generate a package.json file in your application, navigate to your project folder via the terminal or git-bash for windows users and type the following command :

```js
npm init || npm init -y
```

Using npm init without the flag -y will generate some questions that will be able to give a clear description of your application and its dependencies.

### Installing Dependencies

Run this command to install the required dependencies :

```js
npm i express cors  body-parser airtable
```
