//include required modules
const jwt = require("jsonwebtoken");
const config = require("../config/main");
const rp = require("request-promise");

//Use the ApiKey and APISecret from config.js
const payload = {
  iss: config.ZOOM_APIKey,
  exp: new Date().getTime() + 5000,
};
const token = jwt.sign(payload, config.ZOOM_APISecret);

/* API endpoint to create zoom meeting by expert */
exports.createZoomMeeting = function (req, res, next) {
  //store the email address of the user in the email variable
  const { email = "donnieslisthelp@gmail.com" } = req.body;
  //Store the options for Zoom API which will be used to make an API call later.
  var options = {
    //You can use a different uri if you're making an API call to a different Zoom endpoint.
    method: "POST",
    uri: "https://api.zoom.us/v2/users/" + email + "/meetings",
    body: {
      topic: "Meeting",
      type: 2,
      settings: {
        host_video: "true",
        participant_video: true,
        join_before_host: true,
        jbh_time: 0,
      },
    },
    qs: {
      status: "active",
    },
    auth: {
      bearer: token,
    },
    headers: {
      "User-Agent": "Zoom-api-Jwt-Request",
      "content-type": "application/json",
    },
    json: true, //Parse the JSON string in the response
  };

  //Use request-promise module's .then() method to make request calls.
  rp(options)
    .then(function (response) {
      //printing the response on the console
      //   console.log(response);
      res.status(200).json(response);
    })
    .catch(function (err) {
      // API call failed...
      console.log("API call failed, reason ", err);
      res.status(404).json({ message: "User does not exist" });
    });
};
