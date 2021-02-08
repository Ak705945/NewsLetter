const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const https = require('https');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public")); //this is to just get the static files from our own directory otherwise it wont load up

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;
  var data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };

  var JsonData = JSON.stringify(data);

  const url = 'https://us7.api.mailchimp.com/3.0/lists/754373db18'
  const options = {
    method: "POST",
    auth: "armaan:c95a160ced2f4ece66637055c3a88d92-us7"
  }
  const request = https.request(url, options, function(response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    })
  });

  request.write(JsonData);
  request.end();

});

app.listen(process.env.PORT, function() {
  console.log("Started Server.....");
});



// Api key c95a160ced2f4ece66637055c3a88d92-us7

// list id 754373db18
