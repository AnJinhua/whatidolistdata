const stripe = require("stripe");
const multer = require("multer");
const express = require("express");
const passport = require("passport");
const fs = require("fs");
const { encryptQueryParams } = require("query-string-hash");
// const bcrypt = require('bcryptjs');
const MainSettings = require("./config/main");
require("./config/passport")(passport);

const { ROLE_ADMIN } = require("./constants");
// const ROLE_MEMBER = require('./constants').ROLE_MEMBER;
// const ROLE_CLIENT = require('./constants').ROLE_CLIENT;
// const ROLE_OWNER = require('./constants').ROLE_OWNER;

/* import controllers */
const AuthenticationController = require("./controllers/authentication");
const UserController = require("./controllers/user");
const CommentController = require("./controllers/comment");
const ZoomController = require("./controllers/zoom");
const ExpertsController = require("./controllers/experts");
const VideoSessionController = require("./controllers/videosession");
const AudioSessionController = require("./controllers/audiosession");
const ArchiveSessionController = require("./controllers/archivesession");
const ChatController = require("./controllers/chat");
const UniversityController = require("./controllers/university");
const ExpertChatController = require("./controllers/expertchat");
const AdminController = require("./controllers/theAdminController");
const TwilioVideoController = require("./controllers/twilio/video/index");
const TwillioChatController = require("./controllers/twilio/chat/index");
const TwillioVoiceController = require("./controllers/twilio/audio/index");
const VideoCallMiddleWare = require("./middleware/videocall.middleware");
const CommunityController = require("./controllers/communityNews");
const ConversationController = require("./controllers/conversation");
const StoriesController = require("./controllers/stories");
const MessageController = require("./controllers/message");
const MediaController = require("./controllers/media");
const MediaPostsController = require("./controllers/mediaPosts");
const CommunicationController = require("./controllers/communication");
const {
  storyUploader,
  messengerUploader,
  mediaUploader,
  profileUploader,
  resumeUploader,
  audioRoomRecordingUploader,
} = require("./controllers/uploaderController");
const StripeController = require("./controllers/stripe");
const CoinbaseController = require("./controllers/coinbase");
const VideoSessionStripeController = require("./controllers/video-session-stripe");
const videoChatControllers = require("./controllers/chatSession");
const { setUserInfo } = require("./helpers");
const PushNotificationController = require("./controllers/pushNotification");
const StripeConnectController = require("./controllers/stripeConnect");
const PaystackController = require("./controllers/paystack");
const TransactionsController = require("./controllers/transactions");
const WalletController = require("./controllers/wallet");
const FeedController = require("./controllers/feed");

/** import model */

const User = require("./models/user");

// storage needed for saving images from forms
const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, "./public/uploads");
  },
  filename(req, file, callback) {
    callback(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploader = multer({ dest: "../client/public/profile_images" });
// const uploader = multer({ dest: '../uploads' })

// var upload = multer({ storage : storage}).array('ProfileImage',2);
const upload = multer({ storage }).fields([
  { name: "RelatedImages1", maxCount: 1 },
]); // upload Midleware

const audioStorage = multer.diskStorage({
  filename: (req, file, cb) => {
    const fileExt = file.originalname.split(".").pop();
    const filename = `${new Date().getTime()}.${fileExt}`;
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/pipeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "audio/mp3" ||
    file.mimetype === "audio/mpeg" ||
    file.mimetype === "audio/wav" ||
    file.mimetype === "audio/ogg" ||
    file.mimetype === "video/mp4" ||
    file.mimetype === "video/ogg" ||
    file.mimetype === "video/webm"
  ) {
    cb(null, true);
  } else {
    console.log("unsupported file format");
    cb(
      {
        message: "Unsupported File Format",
      },
      false
    );
  }
};

const videoFilter = (req, file, cb) => {
  if (
    file.mimetype === "video/mp4" ||
    file.mimetype === "video/ogg" ||
    file.mimetype === "video/webm"
  ) {
    cb(null, true);
  } else {
    console.log("unsupported file format");
    cb(
      {
        message: "Unsupported File Format",
      },
      false
    );
  }
};

const multerUploader = multer({
  audioStorage,
  limits: {
    fieldNameSize: 200,
    // fileSize: 5 * 1024 * 1024,
  },
  fileFilter,
});
const trimmerUploader = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 500 * 1024 * 1024 },
  videoFilter,
});
// const saltRounds = 10;
// const salt = bcrypt.genSaltSync(saltRounds);

// Middleware to require login/auth
const requireAuth = passport.authenticate("jwt", { session: false });
const requireLogin = passport.authenticate("local", {
  // failureRedirect: '/login/failed',
});

module.exports = (app) => {
  // Initializing route groups
  const apiRoutes = express.Router();
  const authRoutes = express.Router();
  const userRoutes = express.Router();
  const usersOwnRoutes = express.Router();
  const chatRoutes = express.Router();
  const storiesRoutes = express.Router();
  const mediaRoutes = express.Router();
  const conversationRoutes = express.Router();
  const messageRoutes = express.Router();
  const expertChatRoutes = express.Router();
  const payRoutes = express.Router();
  const coinbaseRoutes = express.Router();
  const videoSessionStripeRoutes = express.Router();
  const communicationRoutes = express.Router();
  const TwillioRoutes = express.Router();
  const pushNotificationRoutes = express.Router();
  const notificationRoutes = express.Router();
  const stripeConnectRoutes = express.Router();
  const paystackRoutes = express.Router();
  const transactionsRoutes = express.Router();
  const walletRoutes = express.Router();
  const feedRoutes = express.Router();

  //= ========================
  // Experts Routes
  //= ========================

  //= ========================
  // Auth Routes
  //= ========================

  // Set auth routes as subgroup/middleware to apiRoutes
  apiRoutes.use("/auth", authRoutes);
  apiRoutes.use("/twilio", TwillioRoutes);

  // Login route
  authRoutes.post("/login", requireLogin, AuthenticationController.login);

  // Logout route
  authRoutes.post("/logout/:userId", AuthenticationController.logout);

  // Password reset request route (generate/send token)
  authRoutes.post("/forgot-password", AuthenticationController.forgotPassword);

  apiRoutes.get("/auth/login/success", (req, res) => {
    if (req.user && req.user?.verified !== false) {
      const userInfo = setUserInfo(req.user);

      res.status(200).json({
        success: true,
        user: userInfo,
        token: req.user.jwtLoginAccessToken,
        //   cookies: req.cookies
      });
    } else {
      res.status(401).json({
        success: false,
        user: req.user,
        message: "failure",
      });
    }
  });

  // endpoint to logout
  apiRoutes.get("/auth/logout", (req, res) => {
    req.logout();
    req.session.destroy();
    res.clearCookie("DonnieslistCookies");
    res.status(200).json({
      message: "done",
      success: true,
    });
  });

  // login failed  redirect
  apiRoutes.get("/login/failed", (req, res) => {
    res.status(401).json({
      success: false,
      message: "failure",
    });
    res.redirect(MainSettings.website_url);
  });

  //= ========================
  // Google Routes
  //= ========================

  apiRoutes.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["email", "profile"],
      prompt: "select_account",
    })
  );

  //= ========================
  // Google Routes callback
  //= ========================

  apiRoutes.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      failureMessage: "Cannot login with Google, please try again later!",
      failureRedirect: "/login/failed",
    }),
    (req, res) => {
      if (req.user.status == "SUCCESS" && req.user?.slug !==undefined) {
        res.redirect(`${MainSettings.website_url}/edit/expert/${req.user.slug}`);
        res.send("Thank you for signing in!");
      }else{
        res.redirect(`${MainSettings.website_url}`);
      }
      // else {
      //   const queryParams = req.user.data.code;
      //   console.log("user data ", req.user);
      //   const hash = encryptQueryParams(`code=${queryParams}`);
      //   res.redirect(
      //     `${MainSettings.website_url}/register/${req.user.data.email}/?token=${hash}&firstName=${req.user.data.firstName}&lastName=${req.user.data.lastName}`
      //   );
      // }
    }
  );

  //= ========================
  // Facebook Routes
  //= ========================

  apiRoutes.get(
    "/auth/facebook",
    passport.authenticate("facebook", {
      authType: "reauthenticate",
      scope: "email",
    })
  );

  //= ========================
  // Facebook Routes callback
  //= ========================

  apiRoutes.get(
    "/auth/facebook/callback",
    passport.authenticate(
      "facebook",

      {
        failureMessage: "Cannot login with FaceBook, please try again later!",

        failureRedirect: "/login/failed",
      }
    ),
    (req, res) => {
      if (req.user.status == "LOGIN") {
        res.redirect(MainSettings.website_url);
        res.send("Thank you for signing in!");
      } else {
        const queryParams = req.user.data.code;
        const hash = encryptQueryParams(`code=${queryParams}`);
        res.redirect(
          `${MainSettings.website_url}/register/${req.user.data.email}/?token=${hash}`
        );
      }
    }
  );

  //= ========================
  // Twitter Routes
  //= ========================

  apiRoutes.get("/auth/twitter", passport.authenticate("twitter"));
  //= ========================
  // Twitter Routes callback
  //= ========================
  apiRoutes.get(
    "/auth/twitter/callback",
    passport.authenticate("twitter", {
      failureMessage: "Cannot login with Twitter, please try again later!",
      failureRedirect: "/login/failed",
    }),
    (req, res) => {
      if (req.user.status == "SUCCESS") {
        res.redirect(MainSettings.website_url);
        res.send("Thank you for signing in!");
      }
      // else {
      //   const queryParams = req.user.data.code;
      //   const hash = encryptQueryParams(`code=${queryParams}`);
      //   res.redirect(
      //     `${MainSettings.website_url}/register/${req.user.data.email}/?token=${hash}`
      //   );
      // }
    }
  );

  apiRoutes.get("/test-stripe-payment", (req, res) => {
    stripe("sk_test_08cuSozBbGN2QPnpieyjxomZ");
    res.redirect("");
  });

  // Registration route
  authRoutes.post("/register", AuthenticationController.register);

  // @desc    Finish Registration
  // @route   Post /finish-signup'
  // @access  Private
  authRoutes.post(
    "/finish-signup",
    requireAuth,
    AuthenticationController.finishSignUp
  );

  // verify user email
  // @access Public
  authRoutes.get(
    "/verify/:userId/:uniqueString",
    AuthenticationController.verfyEmail
  );

  // check email not used
  // @access Public
  authRoutes.post("/emailValidate", AuthenticationController.emailValidate);

  // Send  email verifiction
  // @access Public
  authRoutes.post("/otp", AuthenticationController.OtpSend);

  // Send  OTP via phone number
  // @access Public
  authRoutes.post("/phoneOtp", AuthenticationController.OtpSendPhone);

  // validate otp
  // @access Public
  authRoutes.post("/otpValidate", AuthenticationController.OtpValidate);

  // Send register acount with otp
  // @access Public
  authRoutes.post("/register2", AuthenticationController.register2);

  // verified message
  // @access Public
  authRoutes.get("/verified/", AuthenticationController.verfied);

  TwillioRoutes.route("/video/token")
    .post(TwilioVideoController.createVideoToken)
    .get(TwilioVideoController.getVideoToken);
  TwillioRoutes.route("/api/greeting").get(TwilioVideoController.greetings);
  TwillioRoutes.route("/chat/token").get(TwillioChatController.getChatToken);
  TwillioRoutes.route("/audio/call").get(TwillioVoiceController.makeVoiceCall);

  // Password reset route (change password using token)
  authRoutes.post(
    "/reset-password/:token",
    AuthenticationController.verifyToken
  );
  authRoutes.post("/change-password", AuthenticationController.changePassword);
  // Signup link for expert
  authRoutes.post(
    "/signupExpertSendSignupLink",
    AuthenticationController.signupExpertSendSignupLink
  );

  // @desc    get logged in users with visiblity on
  // @route   GET /usersloggedin
  // @access  Public
  apiRoutes.get("/loggedIn", UserController.loggedinUsers);

  // @desc    update logedin users location
  // @route   PUT /location
  // @access  Public
  apiRoutes.put("/location", UserController.updateLoaction);

  // @desc    get location visibility
  // @route   GET /visibility
  // @access  Private
  apiRoutes.get(
    "/visibility/:id",
    requireAuth,
    UserController.getlocationVisibility
  );

  // @desc    update location visibility
  // @route   PUT /visibility
  // @access  Public
  apiRoutes.put(
    "/visibility",
    requireAuth,
    UserController.setlocationVisibility
  );

  //create university
  apiRoutes.post("/university", UniversityController.createUniversity);

  //get university by input term
  apiRoutes.get(
    "/university/:searchTerm",
    UniversityController.getUniversitiesBySearchTerm
  );

  // get all users on the database

  // Set user routes as a subgroup/middleware to apiRoutes
  apiRoutes.use("/user", userRoutes);
  apiRoutes.use("/myuserprofile", usersOwnRoutes);
  userRoutes.get("/get-all-users", UserController.getAllUsers);
  userRoutes.post(
    "/update-avatar/:slug",
    requireAuth,
    UserController.updateAvatar
  );

  // View user profile route
  userRoutes.post(
    "/add-story/:slug",
    requireAuth,
    storyUploader.fields([
      { name: "story", maxCount: 1 },
      { name: "thumbnail", maxCount: 1 },
    ]),
    UserController.createNewStory
  );
  userRoutes.get("/get-stories/:slug", UserController.getUserStory);
  userRoutes.get("/:userId", requireAuth, UserController.viewProfile);
  userRoutes.get("/getUserReviews/:userEmail", UserController.getUserReviews);
  userRoutes.post("/add-account-info", UserController.addAccountInfo);
  userRoutes.post("/fetch-account-info", UserController.FetchAccountInfo);
  // userRoutes.post('/add-account-info', UserController.addAccountInfo);

  // Test protected route
  apiRoutes.get("/protected", requireAuth, (req, res) => {
    res.send({ content: "The protected test route is functional!" });
  });

  apiRoutes.get(
    "/admins-only",
    requireAuth,
    AuthenticationController.roleAuthorization(ROLE_ADMIN),
    (req, res) => {
      res.send({ content: "Admin dashboard is working." });
    }
  );

  //= ========================
  // Experts Routes
  //= ========================

  apiRoutes.get(
    "/getExpertsCategoryList",
    ExpertsController.getExpertsCategoryList
  );
  apiRoutes.get(
    "/getExpertsSubCategoryList/:category",
    ExpertsController.getExpertsSubCategoryList
  );
  // apiRoutes.get(
  //   '/getTopicsInSubCategory/:subCategory',
  //   ExpertsController.getTopicsInSubCategory
  // );
  apiRoutes.get(
    "/getExpertsListing/:category",
    ExpertsController.getExpertsListing
  );
  apiRoutes.get(
    "/getExpertsListingByKeyword/:keyword",
    ExpertsController.getExpertsListingByKeyword
  );
  // apiRoutes.get('/getExpertsListingByKeyword', ExpertsController.getExpertsListingByKeyword);
  apiRoutes.get(
    "/getExpertsListing/topRated/:category",
    ExpertsController.getTopExpertsListing
  );
  apiRoutes.get("/getExpertDetail/:slug", ExpertsController.getExpertDetail);
  apiRoutes.get("/getExpertId/:_id", ExpertsController.getExpertId);
  apiRoutes.get("/getExpert/:slug", ExpertsController.getExpert);

  apiRoutes.post("/userExpert/", ExpertsController.userExpert);

  // update user profile
  // @access Private
  apiRoutes.post(
    "/userExpertUpdate/",
    requireAuth,
    resumeUploader.fields([{ name: "file" }]),
    ExpertsController.userExpertUpdate
  );

  // delete user account
  // @access Private
  apiRoutes.delete(
    "/userExpert/:id",
    requireAuth,
    ExpertsController.userExpertDelete
  );

  apiRoutes.post(
    "/uploadFile",
    uploader.single("file"),
    ExpertsController.uploadFile
  );

  // upload images to digitalOcean
  // @access Private
  apiRoutes.post(
    "/profile/uploads3",
    requireAuth,
    profileUploader.fields([{ name: "file", maxCount: 1 }]),
    ExpertsController.uploadS3
  );

  // upload images to digitalOcean
  // @access Private
  apiRoutes.post(
    "/resume/uploads3",
    requireAuth,
    resumeUploader.fields([{ name: "file", maxCount: 1 }]),
    ExpertsController.resumeUploadS3
  );

  apiRoutes.post("/uploadImage", requireAuth, ExpertsController.uploadImage);

  // delete profile images from DB
  // @access Private
  apiRoutes.post("/imageDelete", requireAuth, ExpertsController.deleteImage);

  // upload resume to cloudinary
  // @access Private
  apiRoutes.post("/uploadResume", ExpertsController.uploadResume);

  apiRoutes.post(
    "/sendEmailMessageToExpert",
    ExpertsController.sendEmailMessageToExpert
  );

  apiRoutes.post(
    "/sendTextMessageToExpert",
    ExpertsController.sendTextMessageToExpert
  );
  apiRoutes.post("/createExpert/", ExpertsController.createExpert);

  apiRoutes.post("/saveUserReview/", ExpertsController.saveUserReview);

  apiRoutes.get(
    "/getExpertReviews/:expertSlug",
    ExpertsController.getExpertReviews
  );
  apiRoutes.post("/userExpertUpdate/", ExpertsController.userExpertUpdate);

  apiRoutes.get(
    "/community-news/:community",
    CommunityController.communityNews
  );
  apiRoutes.get(
    "/getExpertStoriesBasedOnRole/:expertRole",
    ExpertsController.getExpertStoriesBasedOnRole
  );

  apiRoutes.get(
    "/getExpertEmailFromToken:token",
    ExpertsController.getExpertEmailFromToken
  );

  apiRoutes.post("/addEndorsements", ExpertsController.addEndorsements);
  apiRoutes.get("/getEndorsements", ExpertsController.getEndorsements);
  apiRoutes.post("/getMyExpertsListing", ExpertsController.getMyExpertsListing);

  apiRoutes.post("/upload");
  //= ========================
  // Session Routes
  //= ========================
  // to be created by expert
  apiRoutes.post(
    "/createVideoSession/",
    VideoSessionController.createVideoSession
  );
  apiRoutes.post(
    "/createvideocall/:expertId",
    requireAuth,
    VideoCallMiddleWare.createVideoCallCheck,
    VideoSessionController.createVideoCallSession
  );

  apiRoutes.post(
    "/endvideocall/:meetingRoom",
    requireAuth,
    VideoCallMiddleWare.createVideoCallCheck,
    VideoSessionController.closeVideoCallSession
  );

  apiRoutes.get(
    "/createchatsession/:identity",
    videoChatControllers.getChatToken
  );
  apiRoutes.get(
    "/joinvideocall/:meetingRoom",
    requireAuth,
    VideoCallMiddleWare.createVideoCallCheck,
    VideoSessionController.joinVideoCallSession
  );
  // to be joined by user
  apiRoutes.post("/joinVideoSession/", VideoSessionController.joinVideoSession);

  // Audio call session route
  apiRoutes.post(
    "/createAudioSession/",
    AudioSessionController.createAudioSession
  );
  apiRoutes.post("/requestForToken", AudioSessionController.requestForToken);

  // recording audio call session route
  apiRoutes.post("/start_recording", ArchiveSessionController.start_recording);
  apiRoutes.get(
    "/stop_recording/:expertEmail/:userEmail/:archiveID",
    ArchiveSessionController.stop_recording
  );
  apiRoutes.post(
    "/getArchiveSessionAndToken",
    ArchiveSessionController.getArchiveSessionAndToken
  );
  apiRoutes.post("/send_recording", ArchiveSessionController.send_recording);

  apiRoutes.post(
    "/getExpertRecordings",
    ArchiveSessionController.getExpertRecordings
  );
  apiRoutes.post(
    "/playRecordedAudio",
    ArchiveSessionController.playRecordedAudio
  );
  apiRoutes.post(
    "/deleteRecordedAudio",
    ArchiveSessionController.deleteRecordedAudio
  );

  // =================================
  // Audio Chat Room Integration Routes
  // =================================
  apiRoutes.get("/experts/search", ExpertsController.searchExperts);
  // apiRoutes.post(
  //   "/room/uploadRecording",
  //   // requireAuth,
  //   audioRoomRecordingUploader.fields([{ name: "file", maxCount: 1 }]),
  //   AudioRoomsController.uploadS3
  // );

  //= ========================
  // stories Routes
  //= ========================
  apiRoutes.use("/stories", storiesRoutes);

  //create story
  storiesRoutes.post(
    "/create",
    requireAuth,
    storyUploader.fields([
      { name: "story", maxCount: 1 },
      { name: "thumbnail", maxCount: 1 },
    ]),
    StoriesController.createStory
  );
  //view story
  storiesRoutes.put("/view/:id", StoriesController.viewUserStory);
  // upload images to cloudinary
  storiesRoutes.post("/uploadImage", StoriesController.uploadStoryImage);
  //uploa Video file to cloudinary
  storiesRoutes.post(
    "/s3upload",
    requireAuth,
    storyUploader.fields([{ name: "file", maxCount: 1 }]),
    StoriesController.uploadS3
  );

  //get user stories by userSlug
  storiesRoutes.get("/:userSlug", StoriesController.getAllUserStories);

  //send email notification for story reply
  storiesRoutes.post(
    "/notification/email",
    // requireAuth,
    StoriesController.sendEmailNotification
  );
  //get stories by :id
  storiesRoutes.get("/story/:id", StoriesController.getStoryById);
  storiesRoutes.get(
    "/community/:community",
    StoriesController.getCommunityStory
  );
  storiesRoutes.delete("/:id", StoriesController.deleteStory);

  //= ========================
  // media Routes // The new routes
  //= ========================
  apiRoutes.use("/media", mediaRoutes);
  mediaRoutes.post(
    "/create",
    requireAuth,
    mediaUploader.fields([
      { name: "media", maxCount: 1 },
      { name: "thumbnail", maxCount: 1 },
    ]),
    MediaController.createMedia
  );

  //upload to s3 bucket
  mediaRoutes.post(
    "/uploadS3",
    requireAuth,
    messengerUploader.fields([{ name: "file", maxCount: 1 }]),
    MediaController.uploadS3
  );

  mediaRoutes.delete("/file/:path/:key", MediaController.deleteFile);

  mediaRoutes.get("/fetch/:id", MediaController.getMediaPost);
  mediaRoutes.get("/all/:userSlug", MediaController.getAllUserMedia);
  mediaRoutes.get("/page/:userSlug", MediaController.getPaginatedUserMedia);

  mediaRoutes.post("/comment/create", MediaController.createMediaComment);
  mediaRoutes.put("/share/:id", MediaController.editMedia);

  mediaRoutes.get(
    "/page/comment/:mediaId",
    MediaController.getPaginatedMediaComments
  );

  mediaRoutes.delete("/:id", MediaController.deleteMedia);
  mediaRoutes.delete("/comment/:id", MediaController.deleteMediaComment);

  // Getting Media for Landing Page
  mediaRoutes.get("/fetchVideos", MediaPostsController.getPaginatedMedia);
  mediaRoutes.post("/likeVideo", MediaPostsController.likeVideo);
  mediaRoutes.post("/unlikeVideo", MediaPostsController.unlikeVideo);

  //= ========================
  // Conversation Routes // The new routes
  //= ========================
  apiRoutes.use("/conversations", conversationRoutes);
  //create a conversation
  conversationRoutes.post("/", ConversationController.createConversation);
  //get active conversation using userSlug
  conversationRoutes.get("/:id", ConversationController.getActiveCoversation);
  //get all conversation using userSlug
  conversationRoutes.get(
    "/all/:id",
    ConversationController.getAllConversations
  );
  //delete conversationRoutes
  conversationRoutes.delete("/:id", ConversationController.deleteConversation);
  //get buggy converstaions
  conversationRoutes.get(
    "/all/bugs",
    ConversationController.getBuggyConversations
  );
  //get ongoing conversation using userSlug
  conversationRoutes.get(
    "/ongoing/:id",
    ConversationController.getOngoingCoversation
  );
  conversationRoutes.get(
    "/page/ongoing/:id",
    ConversationController.getPageOngoingCoversation
  );
  //get archive conversation using userSlug
  conversationRoutes.get(
    "/archive/:id",
    ConversationController.getArchivedCoversation
  );
  //add archive conversation using userSlug
  conversationRoutes.put(
    "/archive/:id",
    ConversationController.addArchiveConversation
  );
  //restore archive conversation using userSlug
  conversationRoutes.put(
    "/restore/:id",
    ConversationController.restoreArchiveConversation
  );
  //block conversation
  conversationRoutes.put(
    "/block/:id",
    ConversationController.blockConversation
  );
  //unblock
  conversationRoutes.put(
    "/unblock/:id",
    ConversationController.unBlockConversation
  );
  //temporary delete conversation using userSlug
  conversationRoutes.put(
    "/delete/:id",
    ConversationController.tempDeleteConversation
  );
  // restore temporary delete conversation using userSlug
  conversationRoutes.put(
    "/restoreTempDeleted/:id",
    ConversationController.restoreTempDeletedConversation
  );
  //permanent delete conversation

  conversationRoutes.delete(
    "/permanentDelete/:id",
    ConversationController.permanentDeleteConversation
  );
  //get conversation using conversationId
  conversationRoutes.get(
    "/conversation/:id",
    ConversationController.getConversationById
  );
  //update conversation
  conversationRoutes.put("/:id", ConversationController.updateConversation);
  //find conversation between two users
  conversationRoutes.get(
    "/find/:firstUserId/:secondUserId",
    ConversationController.findUsersConversation
  );

  //= ========================
  // Message Routes
  //= ========================
  apiRoutes.use("/message", messageRoutes);
  //create a message
  messageRoutes.post("/", MessageController.addNewMessage);
  messageRoutes.post(
    "/uploads3",
    requireAuth,
    messengerUploader.fields([{ name: "file", maxCount: 1 }]),
    MessageController.uploadS3
  );

  messageRoutes.post(
    "/uploadMultiS3",
    requireAuth,
    messengerUploader.fields([{ name: "file", maxCount: 10 }]),
    MessageController.uploadMultiS3
  );

  //upload images to cloudinary
  messageRoutes.post("/uploadImages", MessageController.uploadMultipleImages);
  //create a message with audio
  messageRoutes.post(
    "/uploadAudio",
    multerUploader.single("file"),
    MessageController.addNewMessageWithAudio
  );
  //send email notification for message
  messageRoutes.post("/notifyUser", MessageController.notifyOfflineUsers);
  //send zoom invite link
  messageRoutes.post(
    "/sendZoomNotification",
    MessageController.sendZoomEmailNotification
  );
  messageRoutes.post(
    "/sendAudioRoomNotification",
    MessageController.sendAudioRoomEmailNotification
  );
  messageRoutes.post(
    "/sendStoryReplyNotification",
    MessageController.sendStoryReplyNotification
  );
  //get message by conversatoin id and user slug
  messageRoutes.get(
    "/:conversationId/:userSlug",
    MessageController.getAllMessages
  );
  //get paginated message by conversatoin id and user slug
  messageRoutes.get(
    "/page/:conversationId/:userSlug",
    MessageController.getPaginatedMessages
  );
  //get last message by conversation id
  messageRoutes.get(
    "/last/:conversationId/:userSlug",
    MessageController.getLastMessage
  );
  //get message count
  messageRoutes.get(
    "/count/:conversationId/:userSlug",
    MessageController.getMessageCount
  );
  //get unread messages by user
  messageRoutes.get(
    "/unread/user/:userSlug",
    MessageController.getUnreadMessagesOfUser
  );
  //get unread messages of a conversation
  messageRoutes.get(
    "/unread/:conversationId/:userSlug",
    MessageController.getUnreadMessagesofConversation
  );
  //update message route
  messageRoutes.put("/:id", MessageController.updateMessage);
  //delete message route
  messageRoutes.delete("/:id", MessageController.deleteMessage);

  //= ========================
  // Chat Routes
  //= ========================

  // Set chat routes as a subgroup/middleware to apiRoutes
  apiRoutes.use("/chat", chatRoutes);

  // View messages to and from authenticated user
  chatRoutes.get("/", requireAuth, ChatController.getConversations);

  // Retrieve single conversation
  chatRoutes.get(
    "/:conversationId",
    requireAuth,
    ChatController.getConversation
  );

  // Send reply in conversation
  chatRoutes.post("/:conversationId", requireAuth, ChatController.sendReply);

  // Start new conversation
  chatRoutes.post(
    "/new/:recipient",
    requireAuth,
    ChatController.newConversation
  );

  //= ========================
  // Expert-Session Chat Routes
  //= ========================

  // Set chat routes as a subgroup/middleware to apiRoutes
  apiRoutes.use("/expertchat", expertChatRoutes);

  // View messages to and from authenticated user
  // expertChatRoutes.get('/', requireAuth, ExpertChatController.getConversations);

  // Retrieve single conversation
  expertChatRoutes.get(
    "/fetchSessionChat/:sessionOwnerUsername/:email",
    requireAuth,
    ExpertChatController.fetchSessionChat
  );

  // Send reply in conversation
  expertChatRoutes.post(
    "/expertsessionchat",
    requireAuth,
    ExpertChatController.expertsessionchat
  );

  // Start new conversation
  // expertChatRoutes.post('/new/:recipient', requireAuth, ExpertChatController.newConversation);

  //= ========================
  // Video Session Stripe Payment Routes
  //= ========================
  apiRoutes.use("/videosession", videoSessionStripeRoutes);

  videoSessionStripeRoutes.post(
    "/recharge-video-session",
    VideoSessionStripeController.rechargeVideoSession
  );
  videoSessionStripeRoutes.post(
    "/add-money-to-wallet",
    VideoSessionStripeController.addMoneyToWallet
  );
  videoSessionStripeRoutes.post(
    "/payment-video-session",
    VideoSessionStripeController.paymentVideoSession
  );

  videoSessionStripeRoutes.post(
    "/check-before-session-start",
    VideoSessionStripeController.checkBeforeSessionStart
  );
  videoSessionStripeRoutes.post(
    "/save-video-session-info",
    VideoSessionStripeController.saveVideoSessionInfo
  );

  videoSessionStripeRoutes.get(
    "/send-expert-invoice",
    VideoSessionStripeController.sendExpertInvoice
  );

  //= =========================
  // Push Notification Routes
  //= =========================
  apiRoutes.use("/push-notification", pushNotificationRoutes);

  // Save subscription to database
  pushNotificationRoutes.post(
    "/subscribe",
    PushNotificationController.subscribeUser
  );

  // Send push notification to user
  pushNotificationRoutes.post("/notify", PushNotificationController.notifyUser);

  // Send push notification to all subscribers
  pushNotificationRoutes.post(
    "/notifyAllSubscribers",
    PushNotificationController.notifyAllSubscribers
  );

  //= ========================
  // Notification Routes
  // = ========================
  apiRoutes.use("/notifications", notificationRoutes);

  notificationRoutes.get(
    "/:userSlug",
    PushNotificationController.getNotifications
  );

  notificationRoutes.get(
    "/unread/:userSlug",
    PushNotificationController.findUnreadNotifications
  );

  notificationRoutes.put(
    "/:userSlug",
    PushNotificationController.updateNotifications
  );

  //= =========================
  // Stripe Connect Routes
  //= ===========================
  apiRoutes.use("/stripe-connect", stripeConnectRoutes);

  // create a connect account route
  stripeConnectRoutes.post(
    "/account/create",
    StripeConnectController.createStripeConnect
  );

  // create account link route
  stripeConnectRoutes.post(
    "/account/update",
    StripeConnectController.updateStripeConnect
  );

  // get a connected account
  stripeConnectRoutes.get(
    "/account/:userSlug",
    StripeConnectController.getStripeConnect
  );

  stripeConnectRoutes.get(
    "/accounts/:userSlug",
    StripeConnectController.getStripeAccounts
  );

  // delete connected account
  stripeConnectRoutes.delete(
    "/account/:userSlug",
    StripeConnectController.deleteStripeConnect
  );

  // get an account balance
  stripeConnectRoutes.get(
    "/account/balance/:userSlug",
    StripeConnectController.getStripeAccountBalance
  );

  // create a payout for a connected account
  stripeConnectRoutes.post(
    "/account/payout/create/:userSlug",
    StripeConnectController.createStripeAccountPayout
  );

  // get payout info(totaL)
  stripeConnectRoutes.get(
    "/account/payouts/:userSlug",
    StripeConnectController.getStripeAccountPayouts
  );

  // make payment to a connected account
  stripeConnectRoutes.post(
    "/account/payment",
    StripeConnectController.createStripeAccountPayment
  );

  // stripe connect webhook route
  // bodyParser.raw({ type: "application/json" }),
  stripeConnectRoutes.post("/webhook", StripeConnectController.stripeWebhook);

  //= ========================
  // PAYSTACK
  //= ========================
  apiRoutes.use("/paystack", paystackRoutes);

  paystackRoutes.post("/create", PaystackController.createPaystackAccount);

  paystackRoutes.get("/:userSlug", PaystackController.getPaystackAccount);

  paystackRoutes.post("/update", PaystackController.updatePaystackAccount);

  paystackRoutes.delete(
    "/delete/:userSlug",
    PaystackController.deletePaystackAccount
  );

  paystackRoutes.post("/checkout", PaystackController.createPaymentCheckout);

  paystackRoutes.post("/webhook", PaystackController.paystackWebhook);

  //= ========================
  // Wallet Routes
  //= ========================
  apiRoutes.use("/wallet", walletRoutes);

  // GET wallet balance
  walletRoutes.get(
    "/getbalance/:id",
    requireAuth,
    WalletController.getBalanceWallet
  );

  // UPDATE wallet balance
  walletRoutes.post(
    "/addbalance",
    requireAuth,
    WalletController.addBalanceWallet
  );

  //= ========================
  // Transactions Routes
  //= ========================
  apiRoutes.use("/transactions", transactionsRoutes);

  // GET all workouts
  transactionsRoutes.get("/:userSlug", TransactionsController.getTransactions);

  // GET a single workout
  transactionsRoutes.get("/:id", TransactionsController.getTransaction);

  // POST a new workout
  transactionsRoutes.post("/create", TransactionsController.createTransaction);

  // DELETE a workout
  transactionsRoutes.delete("/:id", TransactionsController.deleteTransaction);

  transactionsRoutes.delete("/", TransactionsController.deleteAllTransactions);

  // UPDATE a workout
  transactionsRoutes.patch("/:id", TransactionsController.updateTransaction);

  //= ========================
  // Coinbase Routes
  //= ========================
  apiRoutes.use("/coinbase", coinbaseRoutes);

  // Payment endpoint for Coinbase
  coinbaseRoutes.post("/charge", CoinbaseController.createCharge);

  //= ========================
  // Payment Routes
  //= ========================
  apiRoutes.use("/pay", payRoutes);

  // Payment endpoint for Stripe
  payRoutes.post("/session", StripeController.createCheckoutSession);

  // Webhook endpoint for Stripe
  payRoutes.post("/webhook-notify", StripeController.webhook);

  // Create customer and subscription
  payRoutes.post("/customer", requireAuth, StripeController.createSubscription);

  // Update customer object and billing information
  payRoutes.put(
    "/customer",
    requireAuth,
    StripeController.updateCustomerBillingInfo
  );

  // Delete subscription from customer
  payRoutes.delete(
    "/subscription",
    requireAuth,
    StripeController.deleteSubscription
  );

  // Upgrade or downgrade subscription
  payRoutes.put(
    "/subscription",
    requireAuth,
    StripeController.changeSubscription
  );

  // Fetch customer information
  payRoutes.get("/customer", requireAuth, StripeController.getCustomer);

  //= ========================
  // Communication Routes
  //= ========================
  apiRoutes.use("/communication", communicationRoutes);

  // fetch list of all users for admin
  apiRoutes.get("/getUsersList", AdminController.theAdminsUserList);
  apiRoutes.post("/BanHim", AdminController.AdminToBanOrUnBanUser);

  apiRoutes.post("/deleteHim", AdminController.deleteHim);
  // /api/getuserInfo/
  apiRoutes.post("/getuserInfo/:id", AdminController.AdminGetUserInfo);

  // updating the users information
  apiRoutes.post("/UpdateUserInfo", AdminController.UpdateUserInfo);

  // /GetActiveSessions
  apiRoutes.post("/GetActiveSessions", (req, res) => {
    User.aggregate(
      [
        {
          $match: { role: "Expert", videoSessionAvailability: true },
        },
        {
          $lookup: {
            from: "videosessions",
            localField: "email",
            foreignField: "expertEmail",
            as: "AggregatedDetails",
          },
        },
        {
          $match: {
            "AggregatedDetails.sessionCompletionStatus": "UNCOMPLETED",
            "AggregatedDetails.sessionStatus": "ACTIVE",
          },
        },
        { $sort: { sessionCreationDate: -1 } },
        { $limit: 1 },
      ],
      (err, allUsers) => {
        res.json({ AllUsers: allUsers });
      }
    );
  });
  // fetch my own profile (can be called by all the three)
  usersOwnRoutes.get("/:userId", requireAuth, UserController.viewMyProfile);
  usersOwnRoutes.get(
    "/:userId/:code",
    requireAuth,
    UserController.editMyProfileStripeID
  );

  // relates to profile updation by user itself
  userRoutes.post("/update", UserController.UpdateMyOwnProfile);

  // relates to profilePictureUpdation
  userRoutes.post(
    "/update/profile",
    upload,
    UserController.UpdateMyOwnProfilePicture
  );

  // Send email from contact form
  communicationRoutes.post("/contact", CommunicationController.sendContactForm);

  //= ========================
  // Comment Routes
  //= ========================
  apiRoutes.get("/getComments/:slug", CommentController.getComments);
  apiRoutes.post("/get-replies", CommentController.getReplies);
  apiRoutes.post("/delete-reply", CommentController.deleteReply);
  apiRoutes.post("/addComment", CommentController.addComment);
  apiRoutes.post("/updateComment", CommentController.updateComment);
  apiRoutes.post("/deleteComment", CommentController.deleteComment);
  apiRoutes.post("/likeComment", CommentController.likeComment);
  apiRoutes.post("/dislikeComment", CommentController.dislikeComment);
  //= ========================
  // Feed Routes
  //= ========================
  apiRoutes.use("/feed", feedRoutes);

  feedRoutes.get("/recent-messaged-users/:id", FeedController.getTenPeers);
  feedRoutes.get("/community/:community", FeedController.getCommunity);
  feedRoutes.get("/for-you/:id", FeedController.getForYou);
  feedRoutes.get("/inspiring", FeedController.getInspiring);
  feedRoutes.get("/for-you", FeedController.getNoneUserForYou);

  //= ========================
  // Zoom Routes
  //= ========================
  apiRoutes.post("/zoom/meeting", ZoomController.createZoomMeeting);
  // Set url for API group routes
  app.use("/", apiRoutes);
};
