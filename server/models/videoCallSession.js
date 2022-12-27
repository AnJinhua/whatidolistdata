const mongoose = require("mongoose");

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const VideosessionSchema = new Schema(
  {
    expertId: { type: String, required: true },
    userId: { type: String, required: true },
    roomId: { type: String, required: true },
    sessionStarted: { type: Date, default: Date.now() },
    sessionEnded: { type: Date },
    sessionJoined: { type: Date },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("videocallsession", VideosessionSchema);
