const config = require("../config");
const twilio = require("twilio");
const ClientCapability = twilio.jwt.ClientCapability;
const VoiceResponse = twilio.twiml.VoiceResponse;

exports.generateToken = () => {
  const capability = new ClientCapability({
    accountSid: config.twilio.accountSid,
    authToken: config.twilio.apiSecret,
  });

  capability.addScope(
    new ClientCapability.OutgoingClientScope({
      applicationSid: process.env.TWILIO_TWIML_APP_SID,
    })
  );

  const token = capability.toJwt();

  return token;
};

exports.createVoiceSession = () => {
  let voiceResponse = new VoiceResponse();
  voiceResponse.dial(
    {
      callerId: process.env.TWILIO_NUMBER,
    },
    request.body.number
  );

  return voiceResponse.toString();
  response.type("text/xml");
  response.send();
};
