---
title: Sending SMS Using Node.js, Express & Africa’s Talking SMS API
date: '2021-03-10'
description: Sending SMS Using Node.js, Express & Africa’s Talking SMS API .
tags: ['Africastalking', 'Socket.io', 'Express', 'Sms']
cover: './sms.png'
---

**Short Message Service** (SMS) also commonly referred to as a “text message” is probably one of the oldest communication technologies yet the most powerful information and communication sharing tool.With the advent of telecommunication companies providing APIs, bundling our applications with this universal feature has been made possible and easier hence extending services to the grass root level where internet penetration is still a problem.

In this post, we will be building a web application that sends text message using the Africa’s Talking API,express and Node.js

Here is glimpse of what we shall be building.

<div style="max-width: 1583px;"><div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 53.4496%;"><iframe src="//cdn.iframe.ly/weKYGbG" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allowfullscreen></iframe></div></div>

### **Prerequisites**

This is a beginner friendly tutorial.However some basic knowledge of Html,Css and JavaScript is required.

You will need [Node](https://nodejs.org/en/) and NPM (Node package manager ) installed on your machine to get started. You can verify if the installation was successful through the following commands on your terminal.

```node
node - v && npm - v;
```

### **Initializing Your Application**

Create a folder anywhere on your machine. Navigate to the folder and run :

```init
npm init
```

follow the command line instructions to create a `package.json` file, which defines your app.

The entry point to your application is defined at this stage.By default npm will name the file (index.js) but for the purpose of this post change the name to (app.js).

### **Application Dependencies Installation**

To build our application we will require [Express.js](https://expressjs.com/) ,body-parser, [Africa’s Talking node.js wrapper](https://www.npmjs.com/package/africastalking), ejs and Socket.io as our core dependencies. npm will be used to pull the dependencies into our project.

```install
npm install africastalking express body-parser ejs socket.io --save
```

All the dependencies installed will be highlighted in the package.json file.

### **Configuring The Application Server**

During our initialization process, we named our entry point into the application as `app.js`. In this file we will configure our server by importing the required dependencies and assigning them to variables.

```app.js
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const africastalking = require('africastalking');
```

Since we shall be using Express, which is a robust web application framework for Node.js. We shall configure it by first creating a new instance assigned to a variable:

```app.js
const app = express();

const port = 3000;
```

We imported ejs which is our templating engine & body-parser that acts as our middleware. Let us get to use them .

```
// Template engine setup

app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

```

Next, create an endpoint for your homepage which shall be stored inside a views folder and a public folder that shall store all our JavaScript.Contents in this JavaScript file `(main.js)` shall be used to manipulate the document object model(DOM):

```

// Public folder setup
app.use(express.static(__dirname + '/public'));
// Index route setup
app.get('/', (req, res) => {
res.render('index');
});

```

### **Building The User Interface (HTML)**

Inside the views folder create an index.html file. For our Css, we shall be using [skeleton css](http://getskeleton.com/) boilerplate .This will make our forms appearance awesome. Remember to include links to the `main.js` and skeleton.io scripts which shall be used later.

Your Index.html file should look this after all is done :

```index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/skeleton/2.0.4/skeleton.css" />
  <title>Node SMS Texting</title>
</head>
<body>
  <div class="container">
    <h2>Send SMS Message</h2>
    <input type="tel" name="number" id="number" placeholder="Enter Phone Number...">
    <input type="text" name="msg" id="msg" placeholder="Enter Text Message...">
    <input type="button" id="button" value="Send Text" class="button button-primary">
    <p class="response"></p>
  </div>

  <script src="/socket.io/socket.io.js"></script>
  <script src="js/main.js"></script>
</body>
</html>
```

### **Capturing The Form Submission**

The first step to capturing the form submission is to get the DOM object for each form input element.This is done in the `main.js` file located in the `public/js` directory.

```
const numberInput = document.getElementById('number'),
        textInput = document.getElementById('msg'),
        button = document.getElementById('button'),
        response = document.querySelector('.response');
```

Then make the form submittable by clicking the button.This is accomplished by adding an event listener to the button.

```
button.addEventListener('click', send, false);
```

When we click the button, a function defined as `send` is called.The work of the function is to grab the values from the input.

```
function send() {
// The regex expression below removes all non-numeric chars
const number = numberInput.value.replace(/\D/g, '');
const text = textInput.value;
}
```

### **Sending Form Data Via Fetch API**

`fetch()` allows you to make network requests similar to XMLHttpRequest (XHR). The main difference is that the Fetch API uses Promises, which enables a simpler and cleaner API, avoiding callback hell and having to remember the complex API of XMLHttpRequest.
The fetch API is going to post the values submitted to our express server.

```
fetch('/', {
method: 'post',
headers: {
'Content-type': 'application/json'
},
body: JSON.stringify({number: number, text: text})
})
.then(function(res){
 console.log(res);
})
.catch(function(err){
 console.log(err);
});
```

### **Posting Data To The Express Server**

Adding the following code to the `app.js` file should capture the form submitted to the server side.

```
app.post('/', (req, res) => {
 res.send(req.body);
 console.log(req.body);
});
```

As at this point when you start the server using the command `node app.js` or `nodemon` if you have nodemon installed globally. Your form will be displayed on `localhost:3000.` Enter a phone number and a message on the form and press the send button. You should be able to see the data on the console.

### **Integrating The Africa’s Talking API**

The Africa’s Talking SMS API will enable us dispatch the text messages straight from our browsers to the mobile phones. For this to happen, we need to [register](https://account.africastalking.com/auth/register) for an account with Africa’s Talking.

Once you have registered visit the sandbox section and under the settings tab, set up your `API key.` This a unique code that is passed in to an application programming interface (API) to identify the calling application or user. API keys are used to track and control how the `API` is being used.

On the `app.js` file, set up the Africastalking API key and username as displayed.The username shall be `sandbox` since we shall be using the sandbox environment to test our application.

```
// Init africastalking
const AfricasTalking = new africastalking({
apiKey:'YOUR API KEY',
username: 'sandbox'
}, {debug: true});
```

> For the purpose of this post we shall be storing our API credentials in the app.js file.This is not a good practice as we shall be exposing our credentials.For production applications, store the credentials in a different file then reference them here.

We had already pulled and configured the Africa’s Talking dependencies to our project so lets implement the SMS functionality.

The moment we posted the data from the form to our express server and logged the results to the console we were able to see the number and text submitted.Now lets store them in variables.

```
const to = req.body.number;
const message = req.body.text;
```

Now lets post our text to the Africa’s Talking servers.

```
const sms = AfricasTalking.SMS;
      sms.send({to: `+254${to}`, message})
           //Returns a promise
         .then(success => console.log({message: message, to: to}))
          //Catch errors if any
         .catch(error => console.log(error));
```

Now, try sending an SMS to the number you used on your simulator. Your response should be as the demo application pinned in the beginning of the article.

### **Implementing Socket.io**

[Socket.io](https://socket.io) is a javascript library for real time web applications.It enables bi-directional communication between web clients and servers.We are going to use socket.io to send a success message back to the client once the text has been sent.

At the start of the post we pulled socket.io as our project dependency.Now lets first declare it on `app.js` file :

```
const socketio = require('socket.io');
```

Next lets connect to the socket.io server:

```
// Connect to socket.io
const io = socketio(server);
```

Then lets create a variable that will capture the data from our server and emit it to the client side.

```
const data = {
  message: message,
  number: to
}
// Emit to the client
io.emit('smsStatus', data);
```

To check whether a connection was established on socket.io, Add the following lines of code to your app.js file :

```
io.on('connection', (socket) => {
 console.log('Connected');
 io.on('disconnect', () => {
 console.log('Disconnected');
  })
})
```

Finally, lets now capture our response to the client once the message has been sent. This is achieved through adding the following lines of code to the `main.js` file :

```
const socket = io();
socket.on('smsStatus',function(data){
response.innerHTML ='<h5> message sent to ' + data.number + '</h5>';
})
```

Your end product should now look like the GIF introduced in the beginning of the post.

## **Conclusion**

With the SMS-enabled web you can build variety of products and services such as user authentication, alerts, notifications, general communication tools and bots.

The complete source code to this post can be found [here](https://github.com/musebe/Sms).Feel free to add more features to the project and don't forget to give this post a thumbs up if you found it helpful. Happy Coding !!!
