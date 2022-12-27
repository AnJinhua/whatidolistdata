const { twilio } = require("../config");
const client = require("twilio")(twilio.accountSid, twilio.authToken);

exports.createVoiceCall = () => {
  try {
    console.log("arrived");
    return client.calls
      .create({
        url: "http://demo.twilio.com/docs/voice.xml",
        to: "+250784677044",
        from: "+19795412454",
      })
      .then((call) => console.log(call.sid));
  } catch (error) {
    console.log(error);
  }
};
