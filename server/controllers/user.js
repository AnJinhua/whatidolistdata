const Stripe = require('stripe')
const request = require('request')
const { v4: uuid } = require('uuid')
const config = require('../config/main')
const { setUserInfo } = require('../helpers')
const User = require('../models/user')
const userVerification = require('../models/userVerification')
const UserReview = require('../models/userreview')
const asyncHandler = require('express-async-handler')
const axios = require('axios')
const stripe = Stripe(config.stripeApiKey)
// const nodemailer = require('nodemailer')
// const hbs = require('nodemailer-express-handlebars')
// const sendGridTransport = require('nodemailer-sendgrid-transport')
// const path = require('path')
// const transporter = nodemailer.createTransport(
//   sendGridTransport({
//     auth: {
//       api_key: config.SENDGRID_API,
//     },
//   })
// )

// const handlebarOptions = {
//   viewEngine: {
//     partialsDir: path.resolve('./views/email-templates/notifications/'),
//     defaultLayout: false,
//   },
//   viewPath: path.resolve('./views/email-templates/notifications/'),
// }

// transporter.use('compile', hbs(handlebarOptions))

//= =======================================
// User Routes
//= =======================================
exports.viewProfile = (req, res, next) => {
  const { userId } = req.params
  console.log(userId)
  if (req.user._id.toString() !== userId) {
    return res
      .status(401)
      .json({ error: 'You are not authorized to view this user profile.' })
  }
  User.findById(userId, (err, user) => {
    if (err) {
      res.status(400).json({ error: 'No user could be found for this ID.' })
      return next(err)
    }

    const userToReturn = setUserInfo(user)

    return res.status(200).json({ user: userToReturn })
  })
}

// @desc    get loggedin users that allow location visibility
// @route   GET /api/loggedIn
// @access  Public

exports.loggedinUsers = asyncHandler(async (req, res) => {
  const usersLoggedin = await User.find({
    onlineStatus: 'ONLINE',
    locationVisbility: true,
  })
  res.status(200).json(usersLoggedin)
})

// @desc    update logedin users location
// @route   PUT /location
// @access  Public

exports.updateLoaction = asyncHandler(async (req, res) => {
  const { email } = req.body
  const user = await User.findOne({ email }, (err) => {
    if (err) {
      res.status(404).json({ error: 'No user could be found' })
    }
  })

  if (user) {
    user.locationLat = req.body.locationLat || user.locationLat
    user.locationLng = req.body.locationLng || user.locationLng
    console.log(req.body.locationLat)

    const updatedUser = await user.save()

    res.status(200).json({
      locationLat: updatedUser.locationLat,
      locationLng: updatedUser.locationLng,
    })
  } else {
    res.status(404).json({ error: 'User not found' })
  }
})

// @desc    get  users  location visibility
// @route   GET /visibility
// @access  Public

exports.getlocationVisibility = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id, (err) => {
    if (err) {
      res.status(404).json({ error: 'No user could be found for this ID.' })
    }
  })

  if (user) {
    res.status(200).json(user.locationVisbility)
  } else {
    res.status(404).json({ error: 'No user could be found for this ID.' })
  }
})

// @desc    update locationVisbility
// @route   PUT /visibility
// @access  Public

exports.setlocationVisibility = asyncHandler(async (req, res) => {
  const { email } = req.body

  const user = await User.findOne({ email }, (err) => {
    if (err) {
      res.status(404).json({ error: 'No user could be found.' })
    }
  })

  if (user) {
    user.locationVisbility = req.body.locationVisbility

    const updatedUser = await user.save()

    res.status(200).json({
      locationVisbility: updatedUser.locationVisbility,
    })
  } else {
    res.status(404).json({ error: 'No user could be found.' })
  }
})

// viewMyProfile   users own profile
exports.viewMyProfile = function (req, res, next) {
  const { userId } = req.params

  if (req.user._id.toString() !== userId) {
    return res
      .status(401)
      .json({ error: 'You are not authorized to view this user profile.' })
  }
  User.findById(
    userId,
    {
      email: 1,
      profile: 1,
      expertCategories: 1,
      locationCity: 1,
      locationState: 1,
      locationCountry: 1,
      expertRating: 1,
      expertRates: 1,
      expertContactCC: 1,
      expertFocusExpertise: 1,
      googleURL: 1,
      university: 1,
      resume_path: 1,
      yearsexpertise: 1,
      password: 1,
      contact: 1,
      userBio: 1,
      facebookURL: 1,
      twitterURL: 1,
      instagramURL: 1,
      linkedinURL: 1,
      soundcloudURL: 1,
      youtubeURL: 1,
      snapchatURL: 1,
      profileImage: 1,
      role: 1,
      websiteURL: 1,
      stripeId: 1,
      locationVisbility: 1,
      locationLat: 1,
      locationLng: 1,
    },
    (err, user) => {
      if (err) {
        res.status(400).json({ error: 'No user could be found for this ID.' })
        return next(err)
      }

      return res.status(200).json({ user })
    }
  )
}
// editMyProfileStripeID
exports.editMyProfileStripeID = function (req, res, next) {
  const { userId } = req.params

  request.post(
    {
      url: 'https://connect.stripe.com/oauth/token',
      form: {
        grant_type: 'authorization_code',
        client_id: 'ca_AO6OL4V0irBbASlFy9dnrWoNYVgJC5Ru',
        code: req.params.code,
        client_secret: 'sk_test_z8RFNnoaPTtap4kUehAMQ7Hi',
      },
    },
    (err, r, body) => {
      const accessToken = JSON.parse(body).stripe_user_id
      if (req.user._id.toString() !== userId) {
        return res.json({
          error: 'You are not authorized to view this user profile.',
        })
      }
      User.findById(userId, (err1, user) => {
        if (err1) {
          res.json({ error: 'No user could be found for this ID.' })
          return next(err1)
        }
        user.stripeId = accessToken
        user.save()
        return res.json({
          status: 'success',
          SuccessMessage:
            'Successfully Registered Stripe Payment Configuration',
        })
      })
    }
  )
}

exports.getUserReviews = function (req, res, next) {
  const userEmail = req.param('userEmail')

  UserReview.aggregate(
    [
      {
        $match: { userEmail, reviewBy: 'Expert' },
      },
      {
        $project: {
          createdAt: 1,
          title: 1,
          review: 1,
          rating: 1,
          expertFullName: 1,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ],
    (err, userReviews) => {
      const bind = {}
      if (err) {
        bind.status = 0
        bind.message = 'Oops! error occur while fetching user reviews'
        bind.error = err
      } else if (userReviews) {
        bind.status = 1
        bind.userReviews = userReviews
      } else {
        bind.status = 0
        bind.message = 'No reviews found'
      }

      return res.json(bind)
    }
  )
}

exports.UpdateMyOwnProfile = function (req, res) {
  const {
    email,
    firstName,
    university,
    isMusician,
    lastName,
    password,
    confirm_password,
    userBio,
    expertRates,
    expertCategories,
    expertContact,
    expertRating,
    expertFocusExpertise,
    yearsexpertise,
    locationCountry,
    locationState,
    locationCity,
    facebookURL,
    twitterURL,
    instagramURL,
    soundcloudURL,
    youtubeURL,
    linkedinURL,
    snapchatURL,
    websiteURL,
    googleURL,
  } = req.body.body
  let passchange = false

  User.findOne({ email }, (err, user) => {
    if (err) {
      res.json({ errorMessage: 'Sorry Something Went Wrong' })
    } else {
      user.profile.firstName = firstName
      user.profile.lastName = lastName
      // user.password  = password

      if (confirm_password.length > 0) {
        user.password = confirm_password
        passchange = true
      }

      user.university = university
      user.userBio = userBio
      user.expertRates = expertRates
      user.expertCategories = expertCategories
      user.contact = expertContact
      user.expertFocusExpertise = expertFocusExpertise
      user.yearsexpertise = yearsexpertise
      user.locationCountry = locationCountry
      user.locationState = locationState
      user.locationCity = locationCity
      user.googleURL = googleURL
      user.facebookURL = facebookURL
      user.linkedinURL = linkedinURL
      user.twitterURL = twitterURL
      user.isMusician = isMusician

      if (!user.isMusician) {
        User.updateOne(
          { _id: user._id },
          { $unset: { soundcloudURL: 1, instagramURL: 1, youtubeURL: 1 } },
          { multi: true },
          (err1, response) => {
            console.log('[USER]:[UPDATED]:[USER_NOT_MUSICIAN]')
          }
        )
      } else {
        if (
          instagramURL &&
          instagramURL !== null &&
          instagramURL !== undefined &&
          instagramURL !== ''
        ) {
          user.instagramURL = instagramURL
        }

        if (
          soundcloudURL &&
          soundcloudURL !== null &&
          soundcloudURL !== undefined &&
          soundcloudURL !== ''
        ) {
          user.soundcloudURL = soundcloudURL
        }

        if (
          snapchatURL &&
          snapchatURL !== null &&
          snapchatURL !== undefined &&
          snapchatURL !== ''
        ) {
          user.snapchatURL = snapchatURL
        }
        if (
          websiteURL &&
          websiteURL !== null &&
          websiteURL !== undefined &&
          websiteURL !== ''
        ) {
          user.websiteURL = websiteURL
        }

        if (
          youtubeURL &&
          youtubeURL !== null &&
          youtubeURL !== undefined &&
          youtubeURL !== ''
        ) {
          user.youtubeURL = youtubeURL
        }
      }

      user.save((err1, savedUser) => {
        if (err1) {
          res.json({
            code: 422,
            success: false,
            message: 'Something went wrong!',
          })
        } else if (passchange) {
          res.json({
            code: 200,
            success: true,
            message: 'Profile Update Successfully.',
            passchange: true,
          })
        } else {
          res.json({
            code: 200,
            success: true,
            message: 'Profile Update Successfully.',
          })
        }
      })
    }
  })
}

exports.UpdateMyOwnResume = function (req, res) {
  if (req.body.expertEmail && req.files) {
    const resume_path = req.files
      ? `/uploads/${Date.now()}-${req.files.resume.name}`
      : ''
    if (req.files.resume) {
      const file = req.files.resume
      file.mv(`./public${resume_path}`, (err, res1) => {
        if (err) {
          res.json({
            code: 422,
            success: false,
            errorMessage: 'Something Went Wrong',
          })
        } else {
          console.log('[FILE]:[UPLOADED]')
        }
      })
    }

    User.findOne({ email: req.body.expertEmail }, (err, user) => {
      if (err) {
        res.json({
          code: 422,
          success: false,
          errorMessage: 'Something Went Wrong',
        })
      } else if (!user || user === undefined) {
        res.json({
          code: 422,
          success: false,
          errorMessage: "Sorry user Doesn't exist",
        })
      } else {
        user.resume_path = resume_path
        user.save((err1) => {
          if (err1) {
            res.json({
              code: 422,
              success: false,
              errorMessage: 'Sorry Couldnt Save',
            })
          } else {
            res.json({
              code: 200,
              success: true,
              SuccessMessage: 'Successfully Updated',
            })
          }
        })
      }
    })
  }
}

exports.UpdateMyOwnProfilePicture = function (req, res) {
  if (!req.body.expertEmail) {
    res.json({
      code: 422,
      success: false,
      errorMessage: 'Something Went Wrong',
    })
  }

  if (!req.files) {
    res.json({
      code: 422,
      success: false,
      errorMessage: 'Something Went Wrong',
    })
  }

  if (!req.files.profileImage) {
    res.json({
      code: 422,
      success: false,
      errorMessage: 'Something Went Wrong',
    })
  }

  const profile_path = `/uploads/${Date.now()}-${req.files.profileImage.name}`
  if (req.files.profileImage) {
    const file = req.files.profileImage
    file.mv(`./public${profile_path}`, (err, res1) => {
      if (err) {
        res.json({
          code: 422,
          success: false,
          errorMessage: 'Something Went Wrong',
        })
      } else {
        console.log('[FILE]:[UPDATED]')
      }
    })
  }

  if (req.body.expertEmail && req.files.profileImage) {
    User.findOne({ email: req.body.expertEmail }, (err, user) => {
      if (err) {
        res.json({ errorMessage: 'Something Went Wrong' })
      } else if (!user || user === undefined) {
        res.json({ errorMessage: "Sorry user Doesn't exist" })
      } else {
        user.profileImage = profile_path
        user.save((err1) => {
          if (err1) {
            res.json({ errorMessage: 'Sorry Couldnt Save' })
          } else {
            res.json({
              code: 200,
              success: true,
              SuccessMessage: 'Successfully Updated',
            })
          }
        })
      }
    })
  }
}

exports.addAccountInfo = function (req, res, next) {
  const bind = {}
  const { emailId } = req.body.body
  const { exp_month } = req.body.body
  const { exp_year } = req.body.body
  const number = req.body.body.car_number
  const { address_city } = req.body.body
  const { address_country } = req.body.body
  const { address_line1 } = req.body.body
  const { address_line2 } = req.body.body
  const { address_state } = req.body.body
  const { address_zip } = req.body.body
  const { cvc } = req.body.body
  const name = req.body.body.car_holder_name

  User.findOne({ email: emailId }, (err, user) => {
    if (err) {
      bind.status = 0
      bind.message = 'Oops! Error occured while fetching user information'
      bind.error = err
      return res.json(bind)
    }
    if (user) {
      stripe.customers.create(
        {
          source: {
            object: 'card',
            exp_month,
            exp_year,
            number,
            address_city,
            address_country,
            address_line1,
            address_line2,
            address_state,
            address_zip,
            cvc,
            name,
          },
          email: emailId,
        },
        (err1, customer) => {
          if (err1) {
            bind.status = 0
            bind.message = 'Oops! Error occur while creating customer in stripe'
            bind.error = err1
            return res.json(bind)
          }
          const customer_id = customer.id
          user.stripe.customerId = customer_id
          user.stripe.cardInfo.exp_month = exp_month
          user.stripe.cardInfo.exp_year = exp_year
          user.stripe.cardInfo.number = number
          user.stripe.cardInfo.address_city = address_city
          user.stripe.cardInfo.address_country = address_country
          user.stripe.cardInfo.address_line1 = address_line1
          user.stripe.cardInfo.address_line2 = address_line2
          user.stripe.cardInfo.address_state = address_state
          user.stripe.cardInfo.address_zip = address_zip
          user.stripe.cardInfo.cvc = cvc
          user.stripe.cardInfo.name = name

          user.save((err2) => {
            if (err1) {
              bind.status = 0
              bind.message =
                'Oops! Error occured while saving user account info'
              bind.error = err2
            } else {
              bind.status = 1
              bind.message = 'User account info was saved successfully'
              bind.customer = customer
            }
            return res.json(bind)
          })
        }
      )
    } else {
      bind.status = 0
      bind.message = 'No user found'
      return res.json(bind)
    }
  })
}
// FetchAccountInfo
exports.FetchAccountInfo = function (req, res, next) {
  const { emailId } = req.body.body
  const bind = {}
  User.findOne({ email: emailId }, (err, user) => {
    if (err) {
      bind.status = 0
      bind.message = 'Oops! Error Occured While Fetching User'
      bind.error = err
      return res.json(bind)
    }
    if (user && user !== null) {
      res.json({ user: user.stripe })
    } else {
      bind.status = 0
      bind.message = 'Oops! No Such User Found'
      bind.error = err
      return res.json(bind)
    }
  })
}

exports.createNewStory = function (req, res, next) {
  const slug = req.params.slug
  console.log(req.files)
  console.log(req.file)
  if (!req.files.story || !req.files.thumbnail) {
    return res.json({
      status: false,
      message: 'Both files not uploaded',
    })
  }
  const data = {}
  if (req.files.story[0]) {
    if (req.files.story[0].mimetype.split('/')[0] === 'image') {
      data.storyType = 'photo'
      data.timeLimit = 3
    } else if (req.files.story[0].mimetype.split('/')[0] === 'video') {
      data.storyType = 'video'
      data.timeLimit = 0
    } else {
      return res.status(401).json({
        status: false,
        message: 'Invalid files',
      })
    }
    data.link = req.files.story[0].location
    data.thumbnail = req.files.thumbnail[0].location
    data.storyId = uuid()
  } else {
    return res.status(401).json({
      status: false,
      message: 'File not uploaded',
    })
  }
  User.findOne({ slug })
    .then((user) => {
      if (user.stories) user.stories.push(data)
      else user.stories = [data]
      user.save()
      return res.json({
        status: true,
        message: 'Story uploaded',
        story: user.stories[user.stories.length - 1],
      })
    })
    .catch((err) => {
      console.log(err.message)
      return res.json({
        status: false,
        message: 'Internal server error',
      })
    })
  console.log(req.file)
}

exports.getUserStory = (req, res, next) => {
  User.findOne({ slug: req.params.slug })
    .then((user) => {
      if (user) {
        return res.json({
          status: true,
          message: 'User stories',
          stories: user.stories,
        })
      } else {
        return res.json({
          status: false,
          message: 'User not found',
        })
      }
    })
    .catch((err) => {
      console.log(err.message)
      return res.json({
        status: false,
        message: 'Internal server error',
      })
    })
}
//function that update a user's imageUrl
exports.updateAvatar = async (req, res) => {
  try {
    const updatedAvatar = await User.findOneAndUpdate(
      { slug: req.params.slug },
      { imageUrl: req.body.imageUrl },
      { new: true }
    )

    res.status(200).json({ updatedAvatar })
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ imageCloudinaryRef: { $exists: true } })

    res.status(200).json({ users })
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

// find a user and update imageUrl with req.imageUrl
exports.updateUserProfileImage = (req, res, next) => {
  const { imageUrl } = req.body
  const { slug } = req.params
  User.findOneAndUpdate(
    { slug },
    { imageUrl: imageUrl },
    { new: true },
    (err, user) => {
      if (err) {
        return res.json({
          status: false,
          message: 'Internal server error',
        })
      }
      return res.json({
        status: true,
        message: 'Image updated',
        user,
      })
    }
  )
}

// getAllUsers
//function that find all users that has imageCloudinaryRef in their profile
exports.getAllUsers = async (req, res, next) => {
  try {
    const userHasImg = await User.find({
      imageCloudinaryRef: { $exists: true },
    })
    // const userHasNoImg = await User.find({
    //   imageCloudinaryRef: { $exists: false },
    // });

    userHasImg.forEach(({ imageCloudinaryRef, slug }) => {
      const url = imageCloudinaryRef.url
      const fileName = imageCloudinaryRef.public_id

      fetch(url).then(async (response) => {
        const contentType = response.headers.get('content-type')
        const blob = await response.blob()
        const file = new File([blob], fileName, { contentType })
        const data = new FormData()
        data.append('file', file)

        const url = `http://localhost:3012/profile/s3upload`
        const updateUserUrl = `http://localhost:3012/user/update-avatar`

        const s3Url = await axios.post(url, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        //  axios.post(url, data,);

        // access file here
      })
    })

    res.status(200).json(userHasImg)
  } catch (err) {
    res.status(500).json(err)
  }
}

// exports.updateRoomParticipantInfo = async (req, res) => {
//   try {
//     const user = await User.findOneAndUpdate({ _id: req.params.id }, req.body, {
//       new: true,
//     });

//     return res.status(200).json(user);
//   } catch (err) {
//     return res.status(500).json(err);
//   }
// };

// exports.getUserAudioRoomRole = async (req, res) => {

//  }

// exports.searchExperts = async (req, res) => {
//    const { query } = req.query;
//    console.log(query);

//    const regexString = `.*${query}.*`;

//    try {
//      let results = await User.find({
//        $or: [
//          { "profile.firstName": { $regex: regexString, $options: "i" } }, // /.*${query}.*/i },
//          { "profile.lastName": { $regex: regexString, $options: "i" } },
//        ],
//      });

//      results = results.map((result) => ({
//        _id: result._id,
//        firstName: result.profile.firstName,
//        lastName: result.profile.lastName,
//        peerId: result.peerId,
//        profilePic: result.imageCloudinaryRef.url,
//        audioRoomRole: result.audioRoomRole,
//      }));

//      return res.status(200).json(results);
//    } catch {
//      return res.status(500).json(err);
//    }
// };
