const mongoose = require('mongoose')

const otp = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: { type: Date, default: Date.now, index: { expires: 30 } },
    //After 30 seconds it is deleted automatically from the database
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Otp', otp)
