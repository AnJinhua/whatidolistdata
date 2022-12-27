const nodemailer = require('nodemailer');
const moment = require('moment');
const { v4: uuidv4 } = require("uuid");
const config = require("../config/main");
const videoCallModel = require("../models/videoCallSession");
const { ExtractJwt } = require("passport-jwt");
const OpenTok = require("../lib_opentok/opentok");
const Experts = require("../models/experts");
const ExpertsSubcategories = require("../models/expertssubcategories");
const VideoSession = require("../models/videosession");
const AudioSession = require("../models/audiosession");
const { videoToken } = require("./twilio/video/tokens");
const User = require("../models/user");
const user = require("../models/user");
// Initialize OpenTok
const opentok = new OpenTok(config.opentok_apiKey, config.opentok_apiSecret);

//= =======================================
// Session Routes
//= =======================================

/* API endpoint to create video session by expert */
exports.createVideoSession = function (req, res, next) {
  const { expertSlug } = req.body;
  const { userEmail } = req.body;
  const { sessionOwner } = req.body;

  const bind = {};

  if (sessionOwner === true) {
    User.findOne(
      { slug: expertSlug, role: "Expert", enableAccount: true },
      (err, existingUser) => {
        if (err) {
          bind.status = 0;
          bind.message = "Oops error occured!";
          bind.error = err;
          return res.json(bind);
        }
        if (existingUser) {
          const date1 = new Date();
          const expireTime = new Date(date1);
          expireTime.setMinutes(date1.getMinutes() + 5600);

          if (existingUser.videoSessionId === "") {
            // create new video session for expert
            opentok.createSession((err1, session) => {
              if (err1) {
                return res.json({ err1, sessionId: "", token: "" });
              }

              //  Use the role value appropriate for the user:
              const tokenOptions = {};
              tokenOptions.role = "publisher";
              tokenOptions.data = `username=${existingUser.slug}`;
              // tokenOptions.expireTime = moment(expireTime).unix();  //30 minutes expirty set to token

              existingUser.videoSessionId = session.sessionId;
              existingUser.videoSessionAvailability = true;
              existingUser.expertSessionAvailability = true;

              // Generate a token.
              const token = opentok.generateToken(
                session.sessionId,
                tokenOptions
              );

              existingUser.save((err2) => {
                if (err2) {
                  return res.json({ err2, sessionId: "", token: "" });
                }
                return res.json({
                  err: "",
                  sessionId: session.sessionId,
                  token,
                });
              });
            });
          } else {
            // use existing video session of expert
            // Generate a token.
            const tokenOptions = {};
            tokenOptions.role = "publisher";
            tokenOptions.data = `username=${existingUser.slug}`;
            const token = opentok.generateToken(
              existingUser.videoSessionId,
              tokenOptions
            );

            existingUser.videoSessionAvailability = true;
            existingUser.expertSessionAvailability = true;
            existingUser.save();
            return res.json({
              err: "",
              sessionId: existingUser.videoSessionId,
              token,
            });
          }
        } else {
          bind.status = 0;
          bind.message = "No expert found";
          return res.json(bind);
        }
      }
    );
  } else {
    User.findOne(
      { slug: expertSlug, videoSessionAvailability: true },
      (err, sessionInfo) => {
        if (!err && sessionInfo) {
          const date1 = new Date();
          const expireTime = new Date(date1);
          expireTime.setMinutes(date1.getMinutes() + 5600);

          //  Use the role value appropriate for the user:
          const tokenOptions = {};
          tokenOptions.role = "publisher";
          tokenOptions.expireTime = moment(expireTime).unix(); // 30 minutes expirty set to token

          // Generate a token.
          const token = opentok.generateToken(
            sessionInfo.videoSessionId,
            tokenOptions
          );

          res.json({ sessionId: sessionInfo.videoSessionId, token, err: "" });
        } else {
          res.json({
            err_code: "expert_session_inactive",
            err: "session is not active from expert end",
            sessionId: "",
            token: "",
          });
        }
      }
    );
  }
};

/* API endpoint to extend video session by user for specific time based on timestamp */
exports.extendSession = function (req, res, next) {
  const { expertEmail } = req.body;
  const { userEmail } = req.body;
  const { sessionOwner } = req.body;
  const { sessionExtendTime } = req.body;
  const { sessionId } = req.body;

  VideoSession.findOne(
    {
      expertEmail,
      userEmail,
      sessionId: { $not: { $type: 10 }, $exists: true },
    },
    (err, sessionInfo) => {
      if (!err && sessionInfo) {
        const date1 = new Date();
        const expireTime = new Date(date1);
        expireTime.setMinutes(date1.getMinutes() + 5600);

        const tokenOptions = {};
        tokenOptions.role = "publisher";
        tokenOptions.expireTime = moment(expireTime).unix(); // 30 minutes expirty set to token

        const token = opentok.generateToken(
          sessionInfo.sessionId,
          tokenOptions
        );
        sessionInfo.sessionUserToken = token;
        sessionInfo.sessionPurchasedDuration = "30 min";
        sessionInfo.save((err1) => {
          if (!err1) {
            res.json({ sessionId: sessionInfo.sessionId, token, err: "" });
          } else {
            res.json({
              err: "error while saving token to database",
              sessionId: "",
              token: "",
            });
          }
        });
      }
    }
  );

  // if ((sessionExtendTime !== undefined && sessionExtendTime !== '') && (sessionId !== undefined && sessionId !== '')) {
  //   User.findOne({ email: expertEmail, role: 'Expert', enableAccount: true }, (err, user) => {
  //     if (err) {
  //       return next(err);
  //     }
  //     if (user) {
  //       // Generate a token.

  //       user.sessionId = sessionId;
  //       user.sessionToken = token;
  //       user.sessionStatus = 'ACTIVE';
  //       user.save((err1) => {
  //         if (!err1) {
  //           res.json({ sessionId: session.sessionId, token, err: '' });
  //         } else {
  //           res.json({ err1 });
  //         }
  //       });
  //     }
  //   });
  // } else {
  //   res.json({ err: 'missing parameters' });
  // }
};

/* API endpoint to join video session by user */
exports.joinVideoSession = function (req, res, next) {
  const expertSlug = req.body.slug;

  User.findOne(
    { slug: expertSlug, role: "Expert", enableAccount: true },
    (err, expert) => {
      if (err) {
        return next(err);
      }

      if (expert) {
        if (expert.sessionId) {
          // opentok.createSession(function(err, expert.sessionId) {
          // if(!err){
          const token = opentok.generateToken(expert.sessionId);
          /* existingUser.sessionId      = session.sessionId;
              existingUser.sessionToken   = token;
              existingUser.sessionStatus  = "ACTIVE";
              existingUser.save(function (err) {
                if(!err){
                  res.json({ session: session, token : token, err : "" });
                }else{
                    res.json({err: err});
                }
              }); */
          res.json({ session: expert.sessionId, token, err: "" });
          // res.json({ session: "", token : "", err : "" });
          // }else{
          //  res.json({err: err});
          // }
          // });
        } else {
          res.json({ sessionId: "", token: "", err: "2 error" });
        }
      } else {
        res.json({ sessionId: "", token: "", err: "1 error" });
      }
    }
  );
};

// const sendTokenResponse = (token, res) => {
//   res.set("Content-Type", "application/json");
//   res.send(
//     JSON.stringify({
//       token: token.toJwt(),
//     })
//   );
// };

exports.createVideoCallSession = async (req, res) => {
  const { authorized_user } = req.body;
  const meetingRoom = uuidv4();

  const token = await videoToken(authorized_user.firstName, meetingRoom);
  const saveVideoSession = await videoCallModel.create({
    expertId: req.params.expertId,
    userId: authorized_user._id,
    roomId: meetingRoom,
    sessionStarted: Date.now(),
  });
  try {
    const expertInfo = await user.findById(req.params.expertId);
    return res.status(200).json({
      data: authorized_user.firstName,
      roomId: meetingRoom,
      token: token.toJwt(),
      session: {
        ...saveVideoSession._doc,
      },
    });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error.message,
    });
  }
};

exports.joinVideoCallSession = async (req, res) => {
  const { authorized_user } = req.body;

  const videoSessionInfo = await videoCallModel.findOne({
    roomId: req.params.meetingRoom,
    expertId: authorized_user._id,
  });

  const updateSession = await videoCallModel.findOneAndUpdate(
    { roomId: req.params.meetingRoom },
    {
      sessionJoined: Date.now(),
    }
  );

  const token = await videoToken(
    authorized_user.firstName,
    req.params.meetingRoom
  );
  if (videoSessionInfo) {
    return res.status(200).json({
      data: authorized_user.firstName,
      token: token.toJwt(),
      session: {
        ...videoSessionInfo._doc,
      },
    });
  } else {
    return res.json({
      error: true,
      message: "video session missing ",
    });
  }
};

exports.closeVideoCallSession = async (req, res) => {
  const { authorized_user } = req.body;
  const videoSessionInfo = await videoCallModel.findOne({
    roomId: req.params.meetingRoom,
    expertId: authorized_user._id,
  });

  await videoCallModel.findOneAndUpdate(
    { roomId: req.params.meetingRoom },
    {
      sessionEnded: Date.now(),
    }
  );

  if (videoSessionInfo) {
    return res.status(200).json({
      status: true,
      message: authorized_user.firstName + " ended the call ",
    });
  } else {
    return res.json({
      error: true,
      message: "video session missing ",
    });
  }
};
