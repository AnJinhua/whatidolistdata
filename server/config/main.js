require("dotenv").config();
module.exports = {
  // Secret key for JWT signing and encryption
  GOOGLE_CLIENT_ID:
    "346738516232-96ir83fcupve21d4ni75up22o11ked02.apps.googleusercontent.com",

  GOOGLE_CLIENT_SECRET: "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",

  secret: "super secret passphrase",
  // Database connection information
  // database: 'mongodb://db/donnysuserInfolist',
  // Setting port for server
  port: 3012,
  // Configuring Mailgun API for sending transactional email
  mailgun_priv_key: "mailgun private key here",
  // Configuring Mailgun domain for sending transactional email
  mailgun_domain: "mailgun domain here",
  // Mailchimp API key
  mailchimpApiKey: "mailchimp api key here",
  // SendGrid API key
  sendgridApiKey: "sendgrid api key here",
  DB_URI:
    // "mongodb+srv://horix:horix@cluster0.9w2e0.mongodb.net/donnyslist?retryWrites=true&w=majority",
    "mongodb+srv://user:b7so9AT45321Bw8D@db-mongodb-nyc1-02623-aa7725cd.mongo.ondigitalocean.com/donnyslist?tls=true&authSource=admin&replicaSet=db-mongodb-nyc1-02623",
  // "mongodb+srv://user:9ZWxAZNS3wwKhlPt@cluster0.9w2e0.mongodb.net/donnyslist?retryWrites=true&w=majority",
  CLOUDINARY_API_KEY: 172845712745728,
  CLOUDINARY_API_SECRET: "-PmOcq8tzBWzlPkoumeI6vCV0ys",
  CLOUDINARY_NAME: "dqzqilslm",
  coinbaseApiKey: "6661a186-9f61-4c9e-89f6-15abd087ee99",
  // Stripe API key
  // stripeApiKey: 'sk_test_z8RFNnoaPTtap4kUehAMQ7Hi',

  stripeApiKey:
    "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",
  stripePaymentAdminPercentage: 10, // percentage amount goes to admin for each transaction
  stripePaymentCurrencyCode: "usd",

  // necessary in order to run tests in parallel of the main app
  test_port: 3001,
  test_db: "mern-starter-test",
  test_env: "test",

  website_url: "http://localhost:3000", //TODO  REMOVE LOCALHOST ON MY DEV ENV
  // website_url: 'https://donnieslist.com',

  // website_url: 'https://whatido.app',
  // api_url: ' http://donnies-list-production-svbf8.ondigitalocean.app',
  api_url: "http://localhost:3012", //TODO  REMOVE LOCALHOST ON MY DEV ENV

  // tokbox or opentok api details, trial period
  /* opentok_apiKey : "45891112",
  opentok_apiSecret : "3f67503337306c1937ea508c630c8de248a666bd", */

  // tokbox or opentok api details : live
  // updated on 23 april 2018 by mohit
  opentok_apiKey: "45801242",
  opentok_apiSecret: "1abf51d20a7facfb36dc9e473034ee97767403c0",

  // facebook login authentication
  facebookAuthClientID: "1368264896940920",
  facebookAuthClientSecret: "ae46c7fd045319403f7f0b1966bd55b8",
  facebookAuthCallbackURL: "/auth/facebook/callback",

  // twitter login authentication
  twitterAuthConsumerKey: "nmAC9O0W6t50Kz2WavC9B1eOw",
  twitterAuthConsumerSecret:
    "szvfHAZpnpkiP4b1teuJDR1zDdnGBmx8ZHHcFInRDtoQWfKPap",
  twitterAuthCallbackURL: "/auth/twitter/callback",

  // gmail credentials for sending email : nodemailer && sendgrid
  SENDGRID_API:
    "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",
  gmailEmail: "donnieslisthelp@gmail.com",
  gmailPassword: "donnieslist@1984",
  bucketName: "donnysliststory",
  bucketLocation: "sfo3.digitaloceanspaces.com",
  bucketAccessKeyId: "WG4SBMXMZMSA7OEQY353",
  bucketSecretAccessKey: "Budg6vyxvDYsIk4wAxCzIlYtZ57e0DOhyWy5elFXfaQ",

  twilioAccountSID: "AC498497309e749bdb201a20c3d1e0c1f9",
  twilioauthToken: "121b061847ac6d2b93470aedc1c82ec6",
  twilioFromNumber: "+19107766955",

  ZOOM_APIKey: "aeJnC8c6RxqlQPw7lri8DQ",
  ZOOM_APISecret: "pqakFAa5MrnfW77QrC0u02MXOzSZPQncyHbw",

  MAILTO: "mailto: donnieslisthelp@gmail.com",
  WEBPUSH_PUBLIC_KEY:
    "BO1Yh7z8Y-I_B3zkS6mCD6T2n7ZazuqIiAwJHS6CB31yrQinIhHYYUwYjEK8fDX6VXtwedsWeTxC7NwzpOdvPIs",
  WEBPUSH_PRIVATE_KEY: "dX91RkcH81fVQYrwGtTqIK8dh1ackBPMG5yxTGsrzyc",

  STRIPE_CONNECT_API_KEY:
    "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",
  STRIPE_CONNECT_WEBHOOK_SECRET: "whsec_lUi01LOUMak3jtK5zKmA8aPmqmJuGOTp",

  PAYSTACK_CONNECTION_API_KEY:
    "sk_live_1f4dc1d97306d43e9f3a22e2102d5d7f1b6d8ca6",
};
