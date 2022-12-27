var TokenService = require("./token");
const VoiceActions = require("./voiceCall");

exports.makeVoiceCall = async (req, res) => {
  await VoiceActions.createVoiceCall();
  res.status(200).json({
    message: "message sent ",
  });
};
