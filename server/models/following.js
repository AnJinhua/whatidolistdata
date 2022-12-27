const mongoose = require("mongoose");

const FollowingSchema = new mongoose.Schema(
  {
    followings: [{
        Type: {
            type: String,
            enum: ["community", "expert"],
            required: true,
          },
          userSlug: {
            type: String,
            default: null,
          },
          community: {
            type: String,
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

module.exports = mongoose.model("Following", FollowingSchema);
