const mongoose = require("mongoose");

const MediaCommentSchema = new mongoose.Schema(
  {
    mediaCommentId: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    mediaId: {
      type: String,
      required: true,
    },

    userSlug: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MediaComment", MediaCommentSchema);
