const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt-nodejs");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const validator = require("node-email-validation");
const { v4: uuidv4 } = require("uuid");
const _ = require("lodash");
const path = require("path");
const userVerification = require("../models/userVerification");
const {
  BulkCountryUpdateList,
} = require("twilio/lib/rest/voice/v1/dialingPermissions/bulkCountryUpdate");
const config = require("../config/main");
const sendGridTransport = require("nodemailer-sendgrid-transport");

const { setUserInfo } = require("../helpers");
const { sendRegistrationEmail } = require("../helpers");
const { sendExpertSignupTokenEmail } = require("../helpers");
const { getRole } = require("../helpers");
const MainSettings = require("../config/main");
const User = require("../models/user");
const Otp = require("../models/otp");
const Code = require("../models/regCode");
const ExpertSignupToken = require("../models/expertsignuptoken");
const { request } = require("https");
const { NetworkContext } = require("twilio/lib/rest/supersim/v1/network");

exports.emailValidate = (req, res) => {
  let { email } = req.body;
  // Check for email
  if (!email) {
    return res.json({ error: "Email is Required " });
  }

  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        return res.json({
          status: "FAILED",
          error: "This email address is already in use",
        });
      } else if (!validator.is_email_valid(email)) {
        return res.json({
          status: "FAILED",
          error: "Please input a valid email address",
        });
      } else {
        return res.json({
          status: "PASSED",
          message: "Ok",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.json({
        status: "FAILED",
        message: error,
      });
    });
};

const transporter = nodemailer.createTransport(
  sendGridTransport({
    auth: {
      api_key: config.SENDGRID_API,
    },
  })
);

//= =======================================
// Send verification Email
//= ======================================

const sendVerificationEmail2 = (otp, email, res) => {
  const mailOptions = {
    from: `what i do <no-reply@whatido.app>`,
    to: email,
    subject: `Verify Your Email`,
    html: `  <p><strong>${otp}</strong> is your One Time Passcode, verify your email address to complete the signup and login into your
     account.
   </p>
   <b>
     This <b>expires in 30 Seconds</b>`,
  };
  transporter
    .sendMail(mailOptions)
    .then(() => {
      return res.json({
        success: true,
        status: "PENDING",
        message: "verification email sent",
      });
    })
    .catch((error) => {
      console.log(error);
      return res.json({
        status: "FAILED",
        message: "verification email failed",
      });
    });
};

//= =======================================
// Send verification Phone Number
//= ======================================

const sendVerificationPhoneNumber = (otp, number, res) => {
  const twilioAccountSID = config.twilioAccountSID;
  const twilioauthToken = config.twilioauthToken;
  const twilioFromNumber = config.twilioFromNumber;
  const messageBody = `${otp} is your One Time Passcode, verify your email address to complete the signup and login into your account.
  This expires in 30 Seconds`;
  const client = require("twilio")(twilioAccountSID, twilioauthToken);

  client.messages
    .create({
      to: number,
      from: twilioFromNumber,
      body: messageBody,
    })
    .then(() => {
      return res.json({
        status: true,
        status: "PENDING",
        message: "message has been sent",
      });
    })
    .catch((error) => {
      console.log(error);
      return res.json({
        status: "FAILED",
        message: "verification failed to send",
      });
    });
};

//= =======================================
// Sed verification Email
//= =======================================

const sendVerificationEmail = ({ _id, email }, res) => {
  const uniqueString = uuidv4() + _id;
  const mailOptions = {
    from: `whatido <no-reply@whatido.app`,
    to: email,
    subject: `Verify Your Email`,
    html: `  <p>
     verify your email adress to complete the signup and login into your
     account.
   </p>
   <p>
     This link <b>expires in 6 hours</b>
   </p> <p>Press <a href=${
     config.api_url + "/auth/verify/" + _id + "/" + uniqueString
   }> here </p>`,
  };

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      console.log(error);
      return res.json({
        status: "FAILED",
        message: "An error occurred while salting email",
      });
    }

    bcrypt.hash(uniqueString, salt, null, async (err1, hashedString) => {
      if (err1) {
        console.log(error);
        return res.json({
          status: "FAILED",
          message: "An error occurred while hashing email",
        });
      }
      // set value in userVerification collection
      const newVerification = new userVerification({
        userId: _id,
        uniqueString: hashedString,
        expiresAt: Date.now() + 21600000,
      });
      newVerification
        .save()
        .then(() => {
          transporter
            .sendMail(mailOptions)
            .then(() => {
              return res.json({
                success: true,
                status: "PENDING",
                message: "verification email sent",
              });
            })
            .catch((error) => {
              console.log(error);
              return res.json({
                status: "FAILED",
                message: "verification email failed",
              });
            });
        })
        .catch((error) => {
          console.log(error);
          return res.json({
            status: "FAILED",
            message: "could not save verifiaction record",
          });
        });
    });
  });
};

//= =======================================
// verfiy user  Routes
//= =======================================

exports.verfyEmail = (req, res) => {
  let { userId, uniqueString } = req.params;
  userVerification
    .find()
    .then((result) => {
      if (result.length > 0) {
        const { expiresAt } = result[0];
        const hasedUniqueSring = result[0].uniqueString;
        if (expiresAt < Date.now()) {
          userVerification
            .deleteOne({ userId })
            .then(() => {
              User.deleteOne({ _id: userId })
                .then(() => {
                  let message = "Link has expired. Please signup again";
                  res.redirect(`/auth/verified/?error=true&message=${message}`);
                })
                .catch((error) => {
                  console.log(error);
                  let message = "clearing user with epired unique sting failed";
                  res.redirect(`/auth/verified/?error=true&message=${message}`);
                });
            })
            .catch((error) => {
              console.log(error);
              let message =
                "An error occures while while deleting the expired user  verification record";
              res.redirect(`/auth/verified/?error=true&message=${message}`);
            });
        } else {
          // vaild verication record
          // compare the hashed value

          bcrypt.compare(uniqueString, hasedUniqueSring, (err, result) => {
            if (err) {
              console.log(err);
              let message =
                "An error occures while compairing the unique string";
              res.redirect(`/auth/verified/?error=true&message=${message}`);
            }
            if (result) {
              //string match
              User.updateOne({ _id: userId }, { verified: true })
                .then(() => {
                  userVerification
                    .deleteOne({ userId })
                    .then(() => {
                      res.sendFile(
                        path.join(__dirname, "./../views/verified.html")
                      );
                    })
                    .catch((error) => {
                      console.log(error);
                      let message =
                        "An error occures while finalizing successful verification";
                      res.redirect(
                        `/auth/verified/?error=true&message=${message}`
                      );
                    });
                })
                .catch((error) => {
                  console.log(error);
                  let message =
                    "An error occures while updating user record to show verified";
                  res.redirect(`/auth/verified/?error=true&message=${message}`);
                });
            } else {
              //string don't match
              let message =
                "Invalid verification details passed. Check your inbox";
              res.redirect(`/auth/verified/?error=true&message=${message}`);
            }
          });
        }
      } else {
        let message =
          "Account record does not exist or has been verified already. Please sign up or login";
        res.redirect(`/auth/verified/?error=true&message=${message}`);
      }
    })
    .catch((error) => {
      console.log(error);
      let message =
        "An error occures while checking for existing user verification record";
      res.redirect(`/auth/verified/?error=true&message=${message}`);
    });
};

//= =======================================
// Handel verification  message
//= =======================================

exports.verfied = (req, res) => {
  res.sendFile(path.join(__dirname, "./../views/verified.html"));
};

// Generate JWT
// TO-DO Add issuer and audience
function generateToken(user) {
  return jwt.sign(user, config.secret, {
    expiresIn: 604800, // in seconds
  });
}

// Generate JWT
// TO-DO Add issuer and audience
function generateToken(user) {
  return jwt.sign(user, config.secret, {
    expiresIn: 604800, // in seconds
  });
}

//= =======================================
// Login Route
//= =======================================

exports.login = (req, res) => {
  console.log("hell---");
  // if (req.user.data?.verified === false) {
  //   return res.json({
  //     errorMessage:
  //       'Your account has not be verified check your email for verification link.',
  //   })
  // }
  if (req.user.data?.status === false) {
    return res.json({ errorMessage: "Sorry You've Been Banned" });
  }
  if (req.user) {
    res.setHeader("Access-Control-Allow-Credentials", "true");
    const userInfo = setUserInfo(req.user.data);
    console.log(req.session);
    return res.status(200).json({
      token: `JWT ${generateToken(userInfo)}`,
      user: userInfo,
    });
  }
  return res.sendStatus(404);
};

//= =======================================
// Logout Route
//= =======================================
exports.logout = (req, res, next) => {
  const { userId } = req.params;

  if (!userId) {
    return res
      .status(401)
      .json({ error: "You are not authorized to view this user profile." });
  }
  User.findById(userId)
    .then((user) => {
      user.onlineStatus = "OFFLINE";
      user.save();
      return res.status(200).json({});
    })
    .catch((err) => {
      res.status(400).json({ error: "No user could be found for this ID." });
      return next(err);
    });
};

exports.loginFacebookUser = (req, res, done) => {
  if (req.body.response) {
    User.findOne({ email: req.body.response.email })
      .then((user) => {
        if (user) {
          const userInfo = setUserInfo(user);
          // user.fbLoginAccessToken  = token;
          user.jwtLoginAccessToken = `JWT ${generateToken(userInfo)}`;
          user.loginSource = "Facebook";
          user.onlineStatus = "ONLINE";
          user.role = "User";
          user
            .save()
            .then((doc) => {
              console.log(`** ** ** generateToken user : ${doc}`);
              return res.status(200).json({
                token: `JWT ${generateToken(userInfo)}`,
                user: {
                  _id: doc._id,
                  customerId: doc.email,
                  expertCategories: doc.expertCategories,
                  expertFocusExpertise: doc.expertFocusExpertise,
                  expertRates: doc.expertRates,
                  expertRating: doc.expertRating,
                  facebookURL: doc.facebookURL,
                  firstName: doc.profile.firstName,
                  lastName: doc.profile.lastName,
                  locationCity: doc.locationCity,
                  locationCountry: doc.locationCity,
                  profileImage: doc.profileImage,
                  email: doc.email,
                  slug: doc.slug,
                  profile: doc.profile,
                  gender: doc.gender,
                  userBio: doc.userBio,
                  role: "User",
                },
              });
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          const unixTimeStamp = Date.now();
          const newUser = new User();
          const slug = `${req.body.response.email.substring(
            0,
            req.body.response.email.lastIndexOf("@")
          )}-${unixTimeStamp}`;
          newUser.email = req.body.response.email;
          newUser.password = "rvtech123#";
          newUser.profile.firstName = req.body.response.name;
          newUser.profile.lastName = req.body.response.name;
          newUser.slug = slug;
          newUser.userBio = "Facebook User";
          newUser.loginSource = "Facebook";
          newUser.onlineStatus = "ONLINE";
          newUser.role = "User";
          newUser.profileImage = req.body.response.picture.data.url;
          newUser
            .save()
            .then((doc) => {
              console.log("data added");
              // if successful, return the new user
              const userInfo = setUserInfo(newUser);
              // return done(null, newUser,`JWT ${generateToken(userInfo)}`);

              res.status(200).json({
                token: `JWT ${generateToken(userInfo)}`,
                user: {
                  _id: doc._id,
                  customerId: "",
                  expertCategories: "",
                  expertFocusExpertise: "",
                  expertRates: "",
                  expertRating: "",
                  facebookURL: "",
                  firstName: req.body.response.name,
                  lastName: req.body.response.name,
                  locationCity: "",
                  locationCountry: "",
                  gender: "",
                  profileImage: req.body.response.picture.data.url,
                  email: req.body.response.email,
                  slug,
                  role: newUser.role,
                  userBio: newUser.userBio,
                  profile: {
                    firstName: req.body.response.name,
                    lastName: req.body.response.name,
                  },
                },
              });
            })
            .catch((err) => {
              console.log(`error occured while saving: ${err}`);
              throw err;
            });
        }
      })
      .catch((err) => done(err));
  }
};

//= =======================================
// Facebook Route
//= =======================================
exports.facebookSendJWTtoken = (req, res) => {
  if (req.body.token) {
    User.findOne({ jwtLoginAccessToken: req.body.token })
      .then((userInfo) => {
        if (userInfo) {
          setUserInfo(userInfo);
          return res.status(200).json({
            token: userInfo.jwtLoginAccessToken,
            user: userInfo,
          });
        }
        return res.status(200).json({
          token: "",
          user: "",
        });
      })
      .catch(() => res.status(500));
  } else {
    return res.status(200).json({
      token: "",
      user: "",
    });
  }
};

//= =======================================
// Twitter Route
//= =======================================
exports.twitterSendJWTtoken = (req, res) => {
  if (req.body.token) {
    User.findOne({ jwtLoginAccessToken: req.body.token })
      .then((userInfo) => {
        if (userInfo) {
          setUserInfo(userInfo);
          res.status(200).json({
            token: userInfo.jwtLoginAccessToken,
            user: userInfo,
          });
        } else {
          res.status(200).json({
            token: "",
            user: "",
          });
        }
      })
      .catch(() => res.status(500));
  } else {
    res.status(200).json({
      token: "",
      user: "",
    });
  }
};

//= =======================================
// Finsih Registration Route
//= =======================================

exports.finishSignUp = async (req, res, next) => {
  const { firstName } = req.body;
  const { lastName } = req.body;
  const { password } = req.body;
  const { expertise } = req.body;
  const { email } = req.body;

  const role = "Expert";

  const expertSubCategories = "new_category";

  // Return error if no email provided
  if (!email) {
    return res.json({ error: "You must enter an email address." });
  }

  // Return error if no password provided
  if (!password) {
    return res.json({ error: "You must enter a password." });
  }

  // Return error if no expertise provided
  if (!expertise) {
    return res.json({ error: "You must enter a expertise." });
  }

  // Mail checking

  if (!validator.is_email_valid(email)) {
    return res.json({ err: "Please input valid mail address" });
  }
  let user_obj;

  try {
    user_obj = await User.findOne({ email: email });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }

  if (user_obj) {
    let updateduser = {
      email: email,
      password: password,
      profile: { firstName, lastName },
      expertSubCategories: expertSubCategories,
      role: role,
      expertCategories: expertise,
    };

    bcrypt.genSalt(5, (err, salt) => {
      if (err) return next(err);
      bcrypt.hash(updateduser.password, salt, null, async (err1, hash) => {
        if (err1) return next(err1);
        updateduser.password = hash;

        updateduser.onlineStatus = "ONLINE";
        try {
          let savedUser = await User.findOneAndUpdate(
            { _id: user_obj._id },
            updateduser,
            { new: true }
          );

          if (savedUser) {
            sendRegistrationEmail(updateduser);
            const userInfo = setUserInfo(savedUser);
            console.log("[SUCCESS]:[USER_REGISTER_SUCCESS");
            return res.json({
              success: true,
              token: `JWT ${generateToken(userInfo)}`,
              user: userInfo,
            });
          }
        } catch (error) {
          console.log(error);
          return res.status(400).json({
            error: true,
            error: error,
          });
        }
      });
    });
  }
};

//= =======================================
// SEND OTP PHONE NUMBER
//= =======================================
exports.OtpSendPhone = (req, res, next) => {
  const { email, number } = req.body;

  // Check for email
  if (!email) {
    return res.json({ error: "Email is Required " });
  }

  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        return res.json({
          status: "FAILED",
          error: "This email address is already in use",
        });
      } else if (!validator.is_email_valid(email)) {
        console.log(email);
        return res.json({
          status: "FAILED",
          error: "Please input a valid email address",
        });
      } else {
        // Generate OTP

        const OTP = otpGenerator.generate(4, {
          digits: true,
          lowerCaseAlphabets: false,
          upperCaseAlphabets: false,
          specialChars: false,
        });

        //save OTP
        const otp = new Otp({ email: email, otp: OTP });
        bcrypt.genSalt(5, async (err, salt) => {
          if (err) return next(err);
          bcrypt.hash(otp.otp, salt, null, (err1, hash) => {
            if (err1) return next(err1);
            otp.otp = hash;
          });
          const result = await otp.save();
          sendVerificationPhoneNumber(OTP, number, res);
        });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.json({
        status: "FAILED",
        message: error,
      });
    });
};

//= =======================================
//SEND OTP EMAIL
//= =======================================
exports.OtpSend = (req, res, next) => {
  const { email } = req.body;

  // Check for email
  if (!email) {
    return res.json({ error: "Email is Required " });
  }

  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        return res.json({
          status: "FAILED",
          error: "This email address is already in use",
        });
      } else if (!validator.is_email_valid(email)) {
        return res.json({
          status: "FAILED",
          error: "Please input a valid email address",
        });
      } else {
        // Generate OTP

        const OTP = otpGenerator.generate(4, {
          digits: true,
          lowerCaseAlphabets: false,
          upperCaseAlphabets: false,
          specialChars: false,
        });

        //save OTP
        const otp = new Otp({ email: email, otp: OTP });
        bcrypt.genSalt(5, async (err, salt) => {
          if (err) return next(err);
          bcrypt.hash(otp.otp, salt, null, (err1, hash) => {
            if (err1) return next(err1);
            otp.otp = hash;
          });
          const result = await otp.save();
          sendVerificationEmail2(OTP, email, res);
        });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.json({
        status: "FAILED",
        message: error,
      });
    });
};

//= =======================================
// Validate Otp
//= =======================================
exports.OtpValidate = async (req, res, next) => {
  const { email, otp } = req.body;
  console.log(email, otp);
  // Return error if no OTP provided
  if (!otp) {
    return res.json({
      error: "OTP required",
      success: false,
    });
  }

  const otpHolder = await Otp.find({
    email: email,
  });
  if (otpHolder.length === 0) {
    return res.json({
      error: "you used an Expired OTP",
      success: false,
    });
  }
  const rightOtpFind = otpHolder[otpHolder.length - 1];

  //compare the OPT provided with the one in the DB
  bcrypt.compare(otp, rightOtpFind.otp, (err, validUser) => {
    if (err) {
      console.log(err);
      res.json({
        error: "An error occures while compairing the unique string.",
        success: false,
      });
    }

    // check if user email and user is Valid
    if (rightOtpFind.email === email && validUser) {
      User.findOne({ email })
        .then(async (existingUser) => {
          if (existingUser) {
            return res.json({
              error: "That email address is already in use.",
              success: false,
            });
          }

          // Generate OTP

          const CODE = otpGenerator.generate(4, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
          });

          //save OTP
          const code = new Code({ email: email, code: CODE });
          bcrypt.genSalt(5, async (err, salt) => {
            if (err) return next(err);
            bcrypt.hash(code.code, salt, null, (err1, hash) => {
              if (err1) return next(err1);
              code.code = hash;
            });
            const result = await code.save();
            return res.status(200).json({
              message: "OTP Validated",
              success: true,
              code: CODE,
            });
          });

          return res.json(code);
        })
        .catch((err) => {
          console.log(err);
          return res.json({ error: "Error in finding user." });
        });
    } else {
      console.log("[FAILED]:[OTP_VALIDATION_FAILED");
      return res.json({
        error: "your code was wrong !",
        success: false,
      });
    }
  });
};

//= =======================================
// Validate Otp
//= =======================================

exports.register2 = async (req, res, next) => {
  // Check for registration errors

  const { email, code, firstName, lastName, password, category, subCategory } =
    req.body;

  // Return error if no firstName provided
  if (!firstName) {
    return res.json({ error: "You must enter a firstName." });
  }

  // Return error if no firstName provided
  if (!lastName) {
    return res.json({ error: "You must enter a lastName" });
  }
  const slugId = uuidv4();
  const slug = `${firstName}-${lastName}-${slugId}`;
  const role = "Expert";

  const expertSubCategories = "new_category";

  // Return error if no email provided
  if (!email) {
    return res.json({ error: "You must enter an email address." });
  }

  // Return error if no Code provided
  if (!code) {
    return res.json({ error: "registration Code required" });
  }

  // Return error if no password provided
  if (!password) {
    return res.json({ error: "You must enter a password." });
  }

  // Return error if no expertise provided
  if (!subCategory) {
    return res.json({ error: "You must enter a expertise." });
  }

  const codeHolder = await Code.find({
    email: email,
  });
  if (codeHolder.length === 0) {
    return res.json({
      error: "you used an expired code",
      success: false,
    });
  }
  const rightCodeFind = codeHolder[codeHolder.length - 1];

  //compare the OPT provided with the one in the DB
  bcrypt.compare(code, rightCodeFind.code, (err, validUser) => {
    if (err) {
      console.log(err);
      res.json({
        error: "An error occures while comparing the unique Code string.",
        success: false,
      });
    }

    // check if user email and user is Valid
    if (rightCodeFind.email === email && validUser) {
      User.findOne({ email })
        .then(async (existingUser) => {
          if (existingUser) {
            console.log("[ERROR]:[NEW USER USED ALREADY EXISTING EMAIL]");
            return res.json({
              error: "This email address is already in use.",
              success: false,
            });
          }
          const user = new User({
            email,
            password,
            profile: { firstName, lastName },
            slug,
            slugId,
            expertSubCategories,
            role,
            expertCategories: subCategory,
            verified: true,
          });
          // encrypt Password
          bcrypt.genSalt(5, (err, salt) => {
            if (err)
              return res.json({
                error: "Password failed to salt." + err,
                success: false,
              });
            bcrypt.hash(user.password, salt, null, (err1, hash) => {
              if (err1)
                return res.json({
                  error: "Password failed to hash." + err,
                  success: false,
                });
              user.password = hash;
            });

            //Save Password
            user.onlineStatus = "ONLINE";
            user
              .save()
              .then(async (savedUser) => {
                if (savedUser) {
                  sendRegistrationEmail(savedUser);
                  const CodeDelete = await Code.deleteMany({
                    email: rightCodeFind.email,
                  });
                  return res.status(200).json({
                    message: "User Registeration Successfull !",
                    success: true,
                    data: savedUser,
                  });
                }
              })
              .catch((err) => {
                console.log(err);
                return res.json({
                  error: "User failed to save .",
                  success: false,
                });
              });
          });
        })
        .catch((err) => {
          console.log(err);
          return res.json({
            error: "Error in finding user.",
            success: false,
          });
        });
    } else {
      return res.status(400).json({
        message: "Your Code was Wrong !",
        success: false,
      });
    }
  });
};

//= =======================================
// Registration Route
//= =======================================
exports.register = (req, res, next) => {
  // Check for registration errors

  const { email } = req.body;
  const { firstName } = req.body;
  // const firstName = email.split('@')[0];
  const { lastName } = req.body;
  const { password } = req.body;
  const { expertise } = req.body;
  // const { cfmPassword } = req.body;
  const slugId = uuidv4();
  const slug = `${req.body.firstName}-${req.body.lastName}-${slugId}`;
  const role = "Expert";

  const expertSubCategories = "new_category";

  // if (!req.body.firstName) {
  //   slug = email.split('@')[0];
  // }

  // Return error if no email provided
  if (!email) {
    return res.json({ error: "You must enter an email address." });
  }

  // Return error if no password provided
  if (!password) {
    return res.json({ error: "You must enter a password." });
  }

  // Return error if no expertise provided
  if (!expertise) {
    return res.json({ error: "You must enter a expertise." });
  }

  // Mail checking

  if (!validator.is_email_valid(email)) {
    return res.json({ err: "Please input valid mail address" });
  }

  /* if ( password != cfmPassword) {
    return res.json({ error: 'Password and Confirm Password must be same!' });
  } */
  User.findOne({ email })
    .then(async (existingUser) => {
      if (existingUser) {
        console.log("[ERROR]:[NEW USER USED ALREADY EXISTING EMAIL]");
        return res.json({ error: "That email address is already in use." });
      }
      const user = new User({
        email,
        password,
        profile: { firstName, lastName },
        slug,
        slugId,
        expertSubCategories,
        role,
        expertCategories: expertise,
        verified: false,
      });
      await bcrypt.genSalt(5, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, null, (err1, hash) => {
          if (err1) return next(err1);
          user.password = hash;
        });
        console.log(user);
        user.onlineStatus = "ONLINE";
        user
          .save()
          .then((savedUser) => {
            if (savedUser) {
              console.log("now, send mail");
              sendRegistrationEmail(savedUser);
              sendVerificationEmail(savedUser, res);

              // const userInfo = setUserInfo(user)
              // console.log('[SUCCESS]:[USER_REGISTER_SUCCESS')
              // return res.json({
              //   success: true,
              //   token: `JWT ${generateToken(userInfo)}`,
              //   user: userInfo,
              // })
            }
          })
          .catch((err2) => next(err2));
      });
    })
    .catch((err) => next(err));
};

//= =======================================
// Authorization Middleware
//= =======================================

// Role authorization check
exports.roleAuthorization = function (requiredRole) {
  return function (req, res, next) {
    const { user } = req;

    User.findById(user._id)
      .then((foundUser) => {
        // If user is found, check role.
        if (getRole(foundUser.role) >= getRole(requiredRole)) {
          return next();
        }
        return res
          .status(401)
          .json({ error: "You are not authorized to view this content." });
      })
      .catch((err) => {
        res.status(422).json({ error: "No user was found." });
        return next(err);
      });
  };
};

//= =======================================
// Forgot Password Route
//= =======================================

exports.forgotPassword = (req, res, next) => {
  const { email } = req.body;

  User.findOne({ email }, (err, existingUser) => {
    // If user is not found, return error
    if (err || existingUser == null) {
      console.log(
        `\nerr: ${err}\n existingUser: ${JSON.stringify(existingUser)}`
      );
      res.status(422).json({
        succcess: false,
        error:
          "Your request could not be processed as entered. Please try again.",
      });
      return next(err);
    }

    // If user is found, generate and save resetToken

    // Generate a token with Crypto
    crypto.randomBytes(48, (err1, buffer) => {
      const resetToken = buffer.toString("hex");
      if (err1) {
        return next(err1);
      }

      existingUser.resetPasswordToken = resetToken;
      existingUser.resetPasswordExpires = Date.now() + 3600000; // 1 hour

      existingUser.save((err2) => {
        // If error in saving token, return it
        if (err2) {
          return next(err2);
        }

        const html =
          `${
            "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
            "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
            ""
          }${req.headers.origin}/reset-password/${resetToken}\n\n` +
          "If you did not request this, please ignore this email and your password will remain unchanged.\n";

        const mailOptions = {
          from: "Donnies List <no-reply@whatido.app>",
          to: email,
          subject: "Reset Password",
          html,
        };
        transporter.sendMail(mailOptions, (error, response) => {
          if (error) {
            console.log(error);
          } else {
            console.log(`password reset mail sent to ${email}`);
          }
        });

        return res.status(200).json({
          succcess: true,
          message:
            "Please check your email for the link to reset your password.",
        });
      });
    });
  });
};

//= =======================================
// Reset Password Route
//= =======================================

exports.verifyToken = function (req, res, next) {
  console.log(req.params.token);
  User.findOne(
    {
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    },
    async (err, resetUser) => {
      // If query returned no results, token expired or was invalid. Return error.
      if (!resetUser) {
        res.status(422).json({
          success: false,
          error:
            "Your token has expired. Please attempt to reset your password again.",
        });
      } else {
        // Otherwise, save new password and clear resetToken from database
        await bcrypt.genSalt(5, (err, salt) => {
          if (err) return next(err);
          bcrypt.hash(req.body.password, salt, null, (err1, hash) => {
            if (err1) return next(err1);
            resetUser.password = hash;
          });
          resetUser.resetPasswordToken = undefined;
          resetUser.resetPasswordExpires = undefined;

          resetUser.save((err1) => {
            if (err1) {
              return next(err1);
            }

            // If password change saved successfully, alert user via email
            const message = {
              subject: "Password Changed",
              text:
                "You are receiving this email because you changed your password. \n\n" +
                "If you did not request this change, please contact us immediately.",
            };

            // Otherwise, send user email confirmation of password change via Mailgun
            // mailgun.sendEmail(resetUser.email, message);
            const html = `${
              "You are receiving this email because you changed your password. \n\n" +
              "If you did not request this change, please contact us immediately."
            }`;

            const mailOptions = {
              from: "Donnies List <no-reply@whatido.app>",
              to: resetUser.email,
              subject: "Password Changed",
              html,
            };
            transporter.sendMail(mailOptions, (error, response) => {
              if (error) {
                console.log(error);
              } else {
                console.log("password changed mail sent!");
                console.log(response);
              }
            });
          });
          return res.status(200).json({
            message:
              "Password changed successfully. Please login with your new password.",
          });
        });
      }
    }
  );
};

//= =======================================
// Signup Expert Send Signup Link Route
//= =======================================
exports.signupExpertSendSignupLink = function (req, res, next) {
  console.log(req.body);
  // Check for registration errors
  const { email } = req.body;
  const { expertemail } = req.body;
  // let emailtest1=new RegExp("@stanford.edu").test(email);
  // let emailtest2=new RegExp("@harvard.edu").test(email);
  // Return error if no email provided
  if (!email) {
    return res.json({
      error: "You must enter an email address.",
      email,
      expertemail,
    });
  }

  // if(!(emailtest1 || emailtest2)){
  //   return res.status(422).send({ error: 'Email Should start with @stanford.edu  or @harvard.edu' });
  // }

  // else if( !/.+@stanford\.edu/.test(email) || !/.+@harvard\.edu/.test(email) ){
  //   return res.json({error: 'Email should be of @stanford.edu OR @harvard.edu', email: email, expertemail: expertemail });
  // }

  User.findOne({ email }, (err, existingUser) => {
    if (err) {
      return next(err);
    }
    let resetToken = "";
    if (existingUser) {
      return res.json({
        error: "This email address is already in use.",
        email,
        expertemail,
      });
    }
    const buf = crypto.randomBytes(48);
    resetToken = buf.toString("hex");
    ExpertSignupToken.findOne({ email }, (err2, existingUserSignupToken) => {
      if (err2) {
        console.error(err2);
        return res.status(500);
      }
      if (existingUserSignupToken) {
        // sendExpertSignupTokenEmail(existingUserSignupToken);
        return res.json({
          message: "Success: Email with signup link is sent to you!",
        });
      }
      // case new account
      const expertSignupToken = new ExpertSignupToken({
        email,
        token: resetToken,
        tokenExpires: Date.now() + 3600000, // 1 hour
      });
      expertSignupToken.save((err1, user) => {
        if (err1) {
          return next(err1);
        }
        if (user) {
          sendExpertSignupTokenEmail(user);
        }
        return res.json({
          message:
            "Congrats! We have sent you link on your email. Please check your email.",
        });
      });
    });
  });
};

// change password
exports.changePassword = async function (req, res, next) {
  console.log("change password controller");
  console.log(req.body);

  const SALT_FACTOR = 5;

  let newPassword = "";

  await bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(req.body.password, salt, null, (err1, hash) => {
      if (err1) return next(err1);
      // console.log(hash);
      newPassword = hash;
      // next();
    });
  });

  console.log("new pass");

  console.log(newPassword);

  User.findOne({ resetPasswordToken: req.body.resetToken }, (err, user) => {
    if (err) {
      console.log("err---");
      console.log(err);
    } else {
      console.log("user---");
      console.log(user);
      if (user) {
        const updateUser = {};
        updateUser.password = newPassword;
        updateUser.resetPasswordToken = null;

        User.findOneAndUpdate(
          { _id: user._id },
          updateUser,
          { new: true },
          (err4, companyObj) => {
            if (err4) {
              console.log("error occured");
              console.log(err4);
              return next(err4);
            }
            console.log("updated successfully");
            console.log(companyObj);
            res.status(201).json({
              success: true,
              message: "Password changed successfully!",
            });
          }
        );
      } else {
        res.status(201).json({
          success: true,
          message: "Something went wrong!",
        });
      }
    }
  });
};
// change password
