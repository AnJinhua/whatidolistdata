const Twilio = require("twilio");
const Chance = require("chance");

const AccessToken = Twilio.jwt.AccessToken;
const ChatGrant = AccessToken.ChatGrant;
const chance = new Chance();
const config = require("../config");

exports.createChatToken = ({ identity }) => {
  const token = new AccessToken(
    config.twilio.accountSid,
    config.twilio.apiKey,
    config.twilio.apiSecret
  );

  token.identity = identity;
  token.addGrant(
    new ChatGrant({
      serviceSid: config.twilio.chatServiceSid,
    })
  );

  return { identiy: token.identity, token: token.toJwt() };
};
