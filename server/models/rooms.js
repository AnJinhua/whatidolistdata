const mongoose = require("mongoose");

const expireDate = () => {
  const currentDate = new Date();
  const expireDate = currentDate.setDate(currentDate.getDate() + 7); //expire after 7 days
  return expireDate;
};

const RoomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
      required: true,
    },
    topics: [String],
    participants: [mongoose.Schema.Types.ObjectId],
    live: { type: Boolean, default: true, required: true },
    expireAt: { type: Date, default: expireDate(), required: true },
    lastPing: { type: Date, default: Date.now(), required: true },
    private: { type: Boolean, default: false, required: true },
    recordingUrl: {
      type: String,
      default: "",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Rooms", RoomSchema);
