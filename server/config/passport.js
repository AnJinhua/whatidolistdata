const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const LocalStrategy = require("passport-local");
const FacebookStrategy = require("passport-facebook").Strategy;
const TwitterStrategy = require("passport-twitter").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const { cloudinary } = require("./cloudinary");
const User = require("../models/user");
const config = require("./main");
const { setUserInfo } = require("../helpers");
const otpGenerator = require("otp-generator");
const Code = require("../models/regCode");
const bcrypt = require("bcrypt-nodejs");

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
  secretOrKey: config.secret,
};

const localOptions = {
  usernameField: "email",
};

function generateToken(user) {
  return jwt.sign(user, config.secret, {
    expiresIn: 604800, // in seconds
  });
}

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    if (user.status === "LOGIN") {
      done(null, user.data._id);
    } else {
      done(null, user.data);
    }
  });

  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id).catch((err) => {
      // console.log('Error deserializing', err)
      // done(err, null)
    });
    if (user) {
      done(null, user);
    } else {
      done(null, id);
    }
  });

  passport.use(
    new GoogleStrategy(
      {
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("GOOGLE AUTH INTEGRATION DATA", profile);
        try {
          let user = await User.findOne({ email: profile._json.email });

          if (user) {
            console.log("google display");
            const userInfo = setUserInfo(user);
            user.jwtLoginAccessToken = `JWT ${generateToken(userInfo)}`;

            user.onlineStatus = "ONLINE";
            user.loginSource = "Gmail";
            user.save((err1) => {
              if (err1) {
                console.log(`error occured while saving: ${err1}`);
              } else {
                console.log("** ** ** generateToken user");
                const loginData = {
                  status: "SUCCESS",
                  data: user,
                  message: "login successful",
                };
                return done(null, loginData);
              }
            });
          } else {
            // Generate OTP
            const CODE = otpGenerator.generate(4, {
              digits: true,
              lowerCaseAlphabets: false,
              upperCaseAlphabets: false,
              specialChars: false,
            });

            //Hash Code
            const code = new Code({
              email: profile.emails[0].value,
              code: CODE,
            });
            bcrypt.genSalt(5, async (err, salt) => {
              if (err) return next(err);
              bcrypt.hash(code.code, salt, null, (err1, hash) => {
                if (err1) return next(err1);
                code.code = hash;
              });

              //save Code
              await code.save();
              // const SignUpData = {
              //   status: "SIGNUP",
              //   data: {
              //     email: profile.emails[0].value,
              //     code: CODE,
              //     firstName: profile._json.given_name,
              //     lastName: profile._json.family_name,
              //   },
              //   message: "Finsih SignUp",
              // };

              // return done(null, SignUpData);
            });

            let newUser = new User();
            const slug = `${profile.emails[0].value.substring(
              0,
              profile.emails[0].value.lastIndexOf("@")
            )}`;
            newUser.email = profile.emails[0].value;
            newUser.profile.firstName = profile._json.given_name;
            newUser.profile.lastName = profile._json.family_name;
            newUser.slug = slug;
            newUser.loginSource = "Gmail";
            newUser.password = "google_user";
            newUser.onlineStatus = "ONLINE";
            if (profile.photos[0].value) {
              try {
                const uploadResponse = await cloudinary.uploader.upload(
                  profile.photos[0].value
                );
                newUser.imageCloudinaryRef = uploadResponse;
              } catch (error) {
                console.log(error);
              }
            }

            newUser.save((err1, doc) => {
              if (err1) {
                console.log(`error occured while saving: ${err1}`);
                throw err1;
              } else {
                console.log("SIGNUP-SUCCESS ..........", doc);
                const userInfo = setUserInfo(doc);

                doc.jwtLoginAccessToken = `JWT ${generateToken(userInfo)}`;
                doc.save((err1, doc2) => {
                  if (err1) {
                    console.log(`error occured while saving: ${err1}`);
                  } else {
                    console.log("** ** ** generateToken user");
                    const loginData = {
                      status: "SUCCESS",
                      slug: `${newUser.profile.firstName}-${newUser.profile.lastName}-${newUser._id}`,
                      data: doc2,
                      message: "Finish SignUp",
                    };
                    return done(null, loginData);
                  }
                });
              }
            });
          }
        } catch (err) {
          console.error(err);
        }
      }
    )
  );

  passport.use(
    new FacebookStrategy(
      {
        clientID: config.facebookAuthClientID,
        clientSecret: config.facebookAuthClientSecret,
        callbackURL: config.facebookAuthCallbackURL,
        // passReqToCallback : true,
        profileFields: [
          "id",
          "emails",
          "picture.type(large)",
          "name",
          "birthday",
          "about",
          "gender",
        ],
      },
      async (token, refreshToken, profile, done) => {
        console.log(profile);
        try {
          let user = await User.findOne({ email: profile.emails[0].value });
          console.log("facebook login");

          if (user) {
            const userInfo = setUserInfo(user);

            user.jwtLoginAccessToken = `JWT ${generateToken(userInfo)}`;
            user.loginSource = "Facebook";
            user.onlineStatus = "ONLINE";
            user.save((err1) => {
              // console.log(`** ** ** generateToken user : ${doc}`)
              if (err1) {
                console.log(`error occured while saving: ${err1}`);
              } else {
                console.log("** ** ** generateToken user");
                const loginData = {
                  status: "LOGIN",
                  data: user,
                  message: "login successful",
                };
                return done(null, loginData);
              }
            });
          } else {
            // Generate OTP
            const CODE = otpGenerator.generate(4, {
              digits: true,
              lowerCaseAlphabets: false,
              upperCaseAlphabets: false,
              specialChars: false,
            });

            //Hash Code
            const code = new Code({
              email: profile.emails[0].value,
              code: CODE,
            });
            bcrypt.genSalt(5, async (err, salt) => {
              if (err) return next(err);
              bcrypt.hash(code.code, salt, null, (err1, hash) => {
                if (err1) return next(err1);
                code.code = hash;
              });

              //save Code
              const result = await code.save();
              const SignUpData = {
                status: "SIGNUP",
                data: {
                  email: profile.emails[0].value,
                  code: CODE,
                },
                message: "Finsih SignUp",
              };

              return done(null, SignUpData);
            });
            // console.log('facebook save')
            // let newUser = new User()
            // const slug = `${profile.emails[0].value.substring(
            //   0,
            //   profile.emails[0].value.lastIndexOf('@')
            // )}`
            // newUser.email = profile.emails[0].value
            // newUser.profile.firstName = profile._json.given_name
            // newUser.profile.lastName = profile._json.family_name
            // newUser.slug = slug
            // newUser.password = 'rvtech123#'
            // newUser.loginSource = 'Facebook'
            // newUser.onlineStatus = 'ONLINE'
            // if (profile.photos[0].value) {
            //   try {
            //     const uploadResponse = await cloudinary.uploader.upload(
            //       profile.photos[0].value
            //     )
            //     newUser.imageCloudinaryRef = uploadResponse
            //   } catch (error) {
            //     console.log(error)
            //   }
            // }

            // newUser.save((err1, doc) => {
            //   if (err1) {
            //     console.log(`error occured while saving: ${err1}`)
            //     throw err1
            //   } else {
            //     const userInfo = setUserInfo(doc)

            //     doc.jwtLoginAccessToken = `JWT ${userInfo}`
            //     doc.save((err1, doc2) => {
            //       if (err1) {
            //         console.log(`error occured while saving: ${err1}`)
            //       } else {
            //         console.log('** ** ** generateToken user')
            //         const loginData = {
            //           status: 'SIGNUP',
            //           data: doc2,
            //           message: 'Finsih SignUp',
            //         }
            //         return done(null, loginData)
            //       }
            //     })
            //   }
            // })
          }
        } catch (err) {
          console.error(err);
        }
      }
    )
  );

  // =========================================================================
  // TWITTER =================================================================
  // =========================================================================
  passport.use(
    new TwitterStrategy(
      {
        consumerKey: config.twitterAuthConsumerKey,
        consumerSecret: config.twitterAuthConsumerSecret,
        callbackURL: config.twitterAuthCallbackURL,
        includeEmail: true,
      },
      async (token, tokenSecret, profile, done) => {
        console.log("TWITTER PAYLOAD ", profile);
        try {
          let user = await User.findOne({ email: profile._json.email });

          if (user) {
            console.log("google display");
            const userInfo = setUserInfo(user);
            user.jwtLoginAccessToken = `JWT ${generateToken(userInfo)}`;

            user.onlineStatus = "ONLINE";
            user.loginSource = "Twitter";
            user.save((err1) => {
              if (err1) {
                console.log(`error occured while saving: ${err1}`);
              } else {
                console.log("** ** ** generateToken user");
                const loginData = {
                  status: "SUCCESS",
                  data: user,
                  message: "login successful",
                };
                return done(null, loginData);
              }
            });
          } else {
            // Generate OTP
            const CODE = otpGenerator.generate(4, {
              digits: true,
              lowerCaseAlphabets: false,
              upperCaseAlphabets: false,
              specialChars: false,
            });

            //Hash Code
            const code = new Code({
              email: profile.emails[0].value,
              code: CODE,
            });
            bcrypt.genSalt(5, async (err, salt) => {
              if (err) return next(err);
              bcrypt.hash(code.code, salt, null, (err1, hash) => {
                if (err1) return next(err1);
                code.code = hash;
              });

              //save Code
              await code.save();
              // const SignUpData = {
              //   status: "SUCCESS",
              //   data: {
              //     email: profile.emails[0].value,
              //     code: CODE,
              //   },
              //   message: "Finsih SignUp",
              // };

              // return done(null, SignUpData);
            });

            let newUser = new User();
            const slug = `${profile.emails[0].value.substring(
              0,
              profile.emails[0].value.lastIndexOf("@")
            )}`;
            newUser.email = profile.emails[0].value;
            newUser.profile.firstName = profile._json.name.split(" ")[0];
            newUser.profile.lastName = profile._json.name.substring(
              profile._json.name.split(" ")[0].length,
              profile._json.name.length
            );
            newUser.slug = slug;
            newUser.loginSource = "Twitter";
            newUser.password = "twitter_user";
            newUser.onlineStatus = "ONLINE";
            if (profile.photos[0].value) {
              try {
                const uploadResponse = await cloudinary.uploader.upload(
                  profile.photos[0].value
                );
                newUser.imageCloudinaryRef = uploadResponse;
              } catch (error) {
                console.log(error);
              }
            }

            newUser.save((err1, doc) => {
              if (err1) {
                console.log(`error occured while saving: ${err1}`);
                throw err1;
              } else {
                console.log("SIGNUP-SUCCESS .............", doc);
                const userInfo = setUserInfo(doc);

                doc.jwtLoginAccessToken = `JWT ${generateToken(userInfo)}`;
                doc.save((err1, doc2) => {
                  if (err1) {
                    console.log(`error occured while saving: ${err1}`);
                  } else {
                    console.log("** ** ** generateToken user");
                    const loginData = {
                      status: "SUCCESS",
                      data: doc2,
                      message: "Finsih SignUp",
                    };
                    return done(null, loginData);
                  }
                });
              }
            });
          }
        } catch (err) {
          console.error(err);
        }
      }
    )
  );

  passport.use(
    new LocalStrategy(localOptions, (email, password, done) => {
      User.findOne({ email }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {
            error:
              "Your login details could not be verified. Please try again.",
          });
        }
        user.comparePassword(password, (err1, isMatch) => {
          if (err1) {
            return done(err1);
          }
          if (!isMatch) {
            return done(null, false, {
              error:
                "Your login details could not be verified. Please try again.",
            });
          }
          if (
            user.enableAccount &&
            user.enableAccount !== null &&
            user.enableAccount !== undefined &&
            user.enableAccount === true
          ) {
            user.onlineStatus = "ONLINE";
            user.save((err2, doc) => {
              const Data = {
                data: doc,
              };
              return done(null, Data);
            });
          } else {
            return done(null, { message: "you've been Banned", status: false });
          }
        });
      });
    })
  );

  passport.use(
    new JwtStrategy(jwtOptions, (payload, done) => {
      User.findById(payload._id, (err, user) => {
        if (err) {
          return done(err, false);
        }
        if (user) {
          if (
            user.enableAccount &&
            user.enableAccount !== null &&
            user.enableAccount !== undefined &&
            user.enableAccount === true
          ) {
            const Data = {
              data: user,
            };
            return done(null, Data);
          } else {
            done(null, false, { message: "Sorry the account is banned" });
          }
        } else {
          done(null, false);
        }
      });
    })
  );
};
