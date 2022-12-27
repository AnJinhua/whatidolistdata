var TokenService = require("./token");

exports.getChatToken = (req, res) => {
  var token = TokenService.createChatToken();

  res.json({
    identity: token.identiy,
    token: token.token,
  });
};
