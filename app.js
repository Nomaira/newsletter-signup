// require express, body-parser and request to app.js
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

// require .env
require('dotenv').config();

// Create express app
const app = express();

// the server accesses the static files: style.css and images
app.use(express.static("public"));

// Tell app to use the body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// Get the signup page
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {

  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);
  
  const xKey = process.env.X_KEY;
  const apiKey = process.env.API_KEY;
  const listKey = process.env.LIST_KEY;
  const authName = process.env.AUTH

  const url = "https://us" + xKey + ".api.mailchimp.com/3.0/lists/" + listKey;

  const options = {
    method: "POST",
    auth: authName + ":" + apiKey
  };

  const request = https.request(url, options, function(response) {

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
  });

  request.write(jsonData);
  request.end();

});

// Post request for the failure route to redirect to the root
app.post("/failure", function(req, res) {
  res.redirect("/");
});

// Set app to listen on port 3000
app.listen(process.env.PORT || 3000, function() {
  console.log("server is running on port 3000.");
});
