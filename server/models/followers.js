const mongoose = require("mongoose");

const FollowersSchema = new mongoose.Schema(
  {
    followers: [{
          userSlug: {
            type: String,
            default: null,
          },
          community: {
            type: Object,
            default: null,
          },
    }],
    userSlug: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Followers", FollowersSchema);
