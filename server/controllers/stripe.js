const Stripe = require("stripe");
const moment = require("moment");

const config = require("../config/main");
const mailgun = require("../config/mailgun");

const stripe = Stripe(config.stripeApiKey);
const User = require("../models/user");
const Transactions = require("../models/transactions");
const { website_url } = require("../config/main");

exports.webhook = (req, res, next) => {
  // Store the event ID from the webhook
  const receivedEvent = req.body.data.id;
  // Request to expand the webhook for added security
  stripe.events.retrieve(receivedEvent, (error, verifiedEvent) => {
    if (error) {
      return next(error);
    }
    // Respond to webhook events, depending on what they are
    switch (verifiedEvent.type) {
      // On successful customer creation
      case "customer.created":
        // console.log('Customer was created...');
        break;
      // On successful invoice payment
      case "invoice.payment_succeeded":
        User.findOne(
          { customerId: verifiedEvent.data.object.customer },
          (err, user) => {
            if (err) {
              return next(err);
            }
            // Add a month to the user's subscription
            user.stripe.activeUntil = moment().add(1, "months");
            // Save user with subscription
            user.save((err1) => {
              if (err1) {
                return err1;
              }
              return res.status(200);
            });
          }
        );
        break;
      case "invoice.payment_failed":
        User.findOne(
          { customerId: verifiedEvent.data.object.customer },
          (err, user) => {
            if (err) {
              return next(err);
            }
            // Send email to customer to inform them their payment failed
            const message = {
              subject: "Payment Failed",
              text:
                `You are receiving this because your most recent payment for $${
                  verifiedEvent.data.object.amount_due / 100
                }failed.` +
                "\nThis could be due to a change or expiration on your provided credit card or interference from your bank." +
                `\nPlease update your payment information as soon as possible by logging in at http://${req.headers.host}`,
            };

            mailgun.sendEmail(user.email, message);
          }
        );
        break;

      default:
        break;
    }
    // Return 200 status to inform Stripe the webhook was received
    return res.status(200);
  });
};

// Create customer object when new customer enters credit card
exports.createSubscription = (req, res, next) => {
  const { plan } = req.body;
  const { stripeToken } = req.body;
  const userEmail = req.user.email;

  User.findById(req.user._id, (error, user) => {
    if (error) {
      return next(error);
    }

    // If the user has a Stripe customer object, save subscription
    if (user.stripe.customerId) {
      return stripe.subscriptions
        .create({
          customer: user.stripe.customerId,
          plan,
        })
        .then((subscription) => {
          user.stripe.lastFour = req.body.lastFour;
          user.stripe.subscriptionId = subscription.id;
          user.stripe.plan = plan;

          user.save((err /* updatedUser */) => {
            if (err) {
              res
                .status(422)
                .send({ error: "There was an error processing your request." });
              return next(err);
            }
            return res.status(200).send({
              message: `You have been successfully subscribed to the ${plan} plan.`,
            });
          });
        })
        .catch((err) => next(err));
    }
    // Otherwise create new Stripe customer object
    return stripe.customers
      .create({
        source: stripeToken,
        email: userEmail,
        plan,
      })
      .then((customer) => {
        const amtOfSubs = customer.subscriptions.total_count;
        user.stripe.lastFour = req.body.lastFour;
        user.stripe.customerId = customer.id;
        user.stripe.subscriptionId =
          customer.subscriptions.data[amtOfSubs - 1].id;
        user.stripe.plan = plan;
        user.save((err /* updatedUser */) => {
          if (err) {
            res
              .status(422)
              .send({ error: "There was an error processing your request." });
            return next(err);
          }
          return res.status(200).send({
            message: `You have been successfully subscribed to the ${plan} plan.`,
          });
        });
      })
      .catch((err) => next(err));
  });
};

exports.changeSubscription = (req, res, next) => {
  // Look up the user requesting a subscription change
  User.findById(req.user._id, (error, userToChange) => {
    if (error) {
      return next(error);
    }
    return stripe.subscriptions
      .update(userToChange.stripe.subscriptionId, { plan: req.body.newPlan })
      .then((subscription) => {
        // On success, save new customer subscription to database
        userToChange.stripe.subscriptionId = subscription.id;
        userToChange.stripe.plan = subscription.plan.id;

        userToChange.save((err) => {
          if (err) {
            res
              .status(422)
              .send({ error: "There was an error processing your request." });
            return next(err);
          }

          return res.status(200).send({
            message: `Your subscription has been successfully updated to the ${subscription.plan.id} plan.`,
          });
        });
      })
      .catch((err) => err);
  });
};

exports.deleteSubscription = (req, res, next) => {
  // Look up the user requesting a subscription change
  User.findById(req.user._id, (error, userToChange) => {
    if (error) {
      return next(error);
    }
    return stripe.subscriptions
      .del(userToChange.stripe.subscriptionId, { at_period_end: true })
      .then((subscription) => {
        userToChange.stripe.subscriptionId = "";
        userToChange.stripe.lastFour = "";
        userToChange.stripe.plan = "";
        userToChange.stripe.activeUntil = moment();

        userToChange.save((err /* savedUser */) => {
          if (err) {
            return next(err);
          }
          return res
            .status(200)
            .json({ message: "Subscription successfully deleted." });
        });
      })
      .catch((err) => next(err));
  });
};

exports.getCustomer = (req, res, next) => {
  User.findById(req.user._id, (error, userToFetch) => {
    if (error) {
      return next(error);
    }
    return stripe.customers
      .retrieve(userToFetch.stripe.customerId)
      .then((customer) => res.status(200).json({ customer }))
      .catch((err) => next(err));
  });
};

exports.updateCustomerBillingInfo = (req, res, next) => {
  User.findById(req.user._id, (error, userToChange) => {
    if (error) {
      return next(error);
    }
    return stripe.customers
      .update(userToChange.stripe.customerId, {
        source: req.body.stripeToken,
      })
      .then((customer) => {
        userToChange.stripe.lastFour = customer.sources.data[0].last4;
        userToChange.save((err /* savedUser */) => {
          if (err) {
            return next(err);
          }

          return res
            .status(200)
            .json({ message: "Payment method successfully updated." });
        });
      })
      .catch((err) => next(err));
  });
};

exports.createCheckoutSession = async (req, res, next) => {
  // console.log(
  //   // req.path,
  //   req.body
  // );

  //TODO get the reciever from the req.body.reciever
  const slug = decodeURI(req.body.location.split("/")[3]);

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "donation",
          },
          unit_amount: +req?.body?.amount * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${website_url}${req?.body?.location}`,
    cancel_url: `${website_url}${req?.body?.location}`,
  });

  const user = await User.findOne({ slug });

  const Transaction = await Transactions.create({
    sender: req?.body?.sender?._id,
    reciever: user._id || req.body.reciever._id,
    type: "donation",
    currency: session.currency,
    paymentid: session.id,
    paymentprovider: "stripe",
    amount: +req?.body?.amount,
  });

  // console.log(session, Transaction);

  // res.redirect(303, session.url);
  res.json({ url: session.url });
};
