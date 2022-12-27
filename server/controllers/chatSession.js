const TokenService = require("../controllers/twilio/chat/token");

exports.getChatToken = (req, res) => {
  var token = TokenService.createChatToken({
    identity: req.params.identity,
  });

  res.json({
    identity: token.identiy,
    token: token.token,
  });
};
