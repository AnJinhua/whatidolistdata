const AudioSession = require("../models/audiosession");

/* API endpoint to create audio session  */
exports.createAudioSession = (req, res /* next */) => {
  const { expertEmail, userEmail } = req.body;

  // expertEmail: { type: String, default: '' },
  // userEmail: { type: String, default: '' },
  // username: { type: String, default: '' },
  // sessionId: { type: String, default: '' },
  // sessionCreationDate: { type: Date, default: Date.now() },
  // sessionDuration: { type: Number, default: 0 },
  // callStartTime: { type: Date },
  // callEndTime: { type: Date },
  // callStatus: { type: String, enum: ['connecting', 'connected', 'completed', 'denied'] }

  const newAudioSession = new AudioSession({
    expertEmail,
    userEmail,
    Name: "Sam",
    Roll: 1,
    Birthday: 2001 - 09 - 08,
  });

  // Save Tutorial in the database
  newAudioSession
    .save(tutorial)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred",
      });
    });
};
