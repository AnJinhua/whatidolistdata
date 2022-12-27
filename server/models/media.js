const mongoose = require("mongoose");

const MediaSchema = new mongoose.Schema(
  {
    mediaId: {
      type: String,
      required: true,
    },
    mediaType: {
      type: String,
      enum: ["image", "text", "imageText", "video", "videoText", "youtube"],
      required: true,
    },
    community: {
      type: String,
      default: null,
    },
    file: {
      type: Array,
      default: [],
    },
    thumbnail: {
      type: Array,
      default: [],
    },
    inspired: {
      type: Array,
      default: [],
    },
    text: {
      type: String,
      default: null,
    },
    userSlug: {
      type: String,
      required: true,
    },
    youtubeLink: {
      type: String,
      default: null,
    },
    shares: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Media", MediaSchema);
