const StripeConnect = require("../models/stripeConnect");
const Transactions = require("../models/transactions");
const User = require("../models/user");
const {
  STRIPE_CONNECT_API_KEY,
  STRIPE_CONNECT_WEBHOOK_SECRET,
} = require("../config/main");
const stripe = require("stripe")(STRIPE_CONNECT_API_KEY);
const { website_url } = require("../config/main");

// Create a stripe connected account for user
exports.createStripeConnect = async (req, res) => {
  const slug = req?.body?.slug;

  try {
    const user = await User.findOne({ slug });

    const stripeUser = StripeConnect.findOne({ slug });

    if (stripeUser.slug === slug) {
      return;
    } else {
      const account = await stripe.accounts.create({
        type: "express",
        country: req?.body?.country,
        business_type: "individual",
        individual: {
          first_name: req?.body?.first_name,
          last_name: req?.body?.last_name,
          email: req?.body?.email,
        },
        metadata: {
          slug: slug,
          name: `${req?.body?.first_name} ${req?.body?.last_name}`,
        },
        settings: { payouts: { schedule: { interval: "manual" } } },
      });

      const newStripeConnect = new StripeConnect({
        user: user._id,
        slug: account.metadata.slug || slug,
        stripe_acct_id: account.id,
        currency: account.default_currency,
        country: account.country || req?.body?.country,
        stripe_acct_type: account.type,
      });

      const data = await newStripeConnect.save();

      const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: `${website_url}${req?.body?.location}`,
        return_url: `${website_url}${req?.body?.location}`,
        type: "account_onboarding",
        collect: "eventually_due",
      });
      res.status(201).json({ account: data, url: accountLink?.url });
    }
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

// Retrieve a stripe connected account
exports.getStripeConnect = async (req, res) => {
  slug = req.params.userSlug;

  try {
    const userStripeAccount = await StripeConnect.findOne({ slug });

    if (userStripeAccount?.stripe_acct_id) {
      const account = await stripe.accounts.retrieve(
        userStripeAccount?.stripe_acct_id
      );

      const balance = await stripe.balance.retrieve({
        stripeAccount: userStripeAccount.stripe_acct_id,
      });

      await StripeConnect.findOneAndUpdate(
        {
          stripe_acct_id: account?.id,
        },
        {
          $set: {
            country: account?.country,
          },
        },
        { new: true }
      );

      res.status(200).json({
        data: userStripeAccount,
        enabled: account.payouts_enabled,
        currency: account?.default_currency,
        balance,
      });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Retrieve connected accounts
exports.getStripeAccounts = async (req, res) => {
  const slug = req.params.userSlug;
  try {
    const stripeAccount = await StripeConnect.find({ slug: slug });

    if (stripeAccount[0]?.stripe_acct_id) {
      const account = await stripe.accounts.retrieve(
        stripeAccount[0]?.stripe_acct_id
      );

      if (account?.payouts_enabled === true) {
        return;
      } else {
        res.send(
          "Your stripe account is not activated for payment. You'll need to create another account and finish the onboarding process."
        );
      }
    } else {
      res.send("Set up your Stripe account to accept payments.");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a connected(custom) account
exports.updateStripeConnect = async (req, res) => {
  // const slug = req.params.userSlug;

  try {
    // const userStripeAccount = await StripeConnect.findOne({ slug });

    // const accountLink = await stripe.accountLinks.create({
    //   account: userStripeAccount.stripe_acct_id,
    //   refresh_url: `${website_url}${req?.body?.location}`,
    //   return_url: `${website_url}${req?.body?.location}`,
    //   type: "account_update",
    // });

    const account = await stripe.accounts.update("acct_1LMRxqPgl4oizWqo", {
      settings: { payouts: { schedule: { interval: "manual" } } },
    });

    res.status(201).json({ success: "success" });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.deleteStripeConnect = async (req, res) => {
  const slug = req.params.userSlug;
  try {
    // const userStripeAccount = await StripeConnect.findOne({ slug });
    const deletedAccount = await StripeConnect.findOneAndDelete({
      slug,
    });

    const account = await stripe.accounts.del(deletedAccount?.stripe_acct_id);

    res.send(account);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// Get balance of a connected account
exports.getStripeAccountBalance = async (req, res) => {
  slug = req.params.userSlug;

  try {
    const userStripeAccount = await StripeConnect.findOne({ slug });

    const balance = await stripe.balance.retrieve({
      stripeAccount: userStripeAccount.stripe_acct_id,
    });

    await StripeConnect.findOneAndUpdate(
      { slug },
      {
        $set: {
          stripe_acct_balance: balance?.pending[0]?.amount,
        },
      },
      { new: true }
    );

    res.status(200).json(balance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// get list of payouts for a connected account
exports.getStripeAccountPayouts = async (req, res) => {
  slug = req.params.userSlug;

  try {
    const userStripeAccount = await StripeConnect.findOne({ slug });

    const payouts = await stripe.payouts.list({
      stripeAccount: userStripeAccount.stripe_acct_id,
    });

    const date = new Date(payouts.data[0]?.created * 1000);
    let payoutsAmount = 0;

    payouts.data.map((payout) => {
      payoutsAmount += payout?.amount;
    });

    await StripeConnect.findOneAndUpdate(
      { slug },
      {
        $set: {
          stripe_payouts_total: payoutsAmount,
          stripe_payout_date: date,
        },
      },
      { new: true }
    );

    res.status(200).json({ payoutsAmount, date: payouts?.data[0]?.created });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// get a payout for a connected account
exports.getStripeAccountPayout = async (req, res) => {
  try {
    const payout = await stripe.payouts.retrieve(req?.body?.payout_id);

    res.status(200).json(payout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// manually create a payout for a connected account
exports.createStripeAccountPayout = async (req, res) => {
  try {
    if (req?.body?.enabled) {
      const payout = await stripe.payouts.create(
        {
          amount: req?.body?.amount * 100,
          currency: req?.body?.currency,
        },
        {
          stripeAccount: req?.body?.account_id,
        }
      );

      res.status(201).json(payout);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Create a payment intent for a connected account
exports.createStripeAccountPayment = async (req, res) => {
  const amount = Math.abs(req?.body?.amount);
  const slug = decodeURI(req.body.location.split("/")[3]);

  try {
    const stripeAccount = await StripeConnect.findOne({ slug });

    if (stripeAccount?.stripe_acct_id) {
      const account = await stripe.accounts.retrieve(
        stripeAccount?.stripe_acct_id
      );

      if (account?.payouts_enabled) {
        const session = await stripe.checkout.sessions.create({
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: "expert reward",
                },
                unit_amount: amount * 100,
              },
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url: `${website_url}${req?.body?.location}`,
          cancel_url: `${website_url}${req?.body?.location}`,
          payment_intent_data: {
            application_fee_amount: amount * 0.1 * 100,
            transfer_data: {
              destination: req?.body?.account,
            },
          },
        });

        const user = await User.findOne({ slug });

        const senderName = `${req?.body?.sender?.profile?.firstName} ${req?.body?.sender?.profile?.lastName}`;

        await Transactions.create({
          sender: req?.body?.sender?._id,
          senderName: senderName,
          senderAvatar: req?.body?.sender?.imageUrl?.cdnUrl,
          receiver: user?._id,
          receiverSlug: slug,
          type: "donation",
          currency: session.currency,
          paymentId: session.id,
          paymentProvider: "stripe",
          paymentMethod: session.payment_method_types[0],
          status: session.payment_status,
          amount: amount,
        });

        res
          .status(201)
          .json({ url: session.url, stripeAccount: stripeAccount });
      } else {
        res.status(400).json({ message: "User cannot receive payments" });
      }
    } else {
      res.status(400).json({ message: "Account not connected" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a payment intent
const createPaymentIntent = async (req, res) => {
  const amount = Math.abs(req?.body?.amount);
  const slug = decodeURI(req.body.location.split("/")[3]);
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "whatido reward",
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${website_url}${req?.body?.location}`,
      cancel_url: `${website_url}${req?.body?.location}`,
    });

    const user = await User.findOne({ slug });

    const senderName = `${req?.body?.sender?.profile?.firstName} ${req?.body?.sender?.profile?.lastName}`;

    await Transactions.create({
      sender: req?.body?.sender?._id,
      senderName: senderName,
      senderAvatar: req?.body?.sender?.imageUrl?.cdnUrl,
      receiver: user?._id,
      receiverSlug: "whatido",
      type: "donation",
      currency: session.currency,
      paymentId: session.id,
      paymentProvider: "stripe",
      paymentMethod: session.payment_method_types[0],
      status: session.payment_status,
      amount: amount,
    });

    res.status(201).json({ url: session.url });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// WEBHOOK FUNCTIONS
const fulfillPayment = async (session) => {
  try {
    await Transactions.findOneAndUpdate(
      { paymentId: session.id },
      {
        $set: { status: session.payment_status },
      }
    );

    return session;
  } catch (error) {
    return error;
  }
};

const updateAccountStatus = async (account) => {
  try {
    const data = await StripeConnect.findOneAndUpdate(
      {
        stripe_acct_id: account.id,
      },
      {
        $set: {
          country: account.country,
        },
      },
      { new: true }
    );
  } catch (error) {
    return error;
  }
};

// Stripe webhook that listens for completed checkout events
exports.stripeWebhook = async (req, res) => {
  const payload = req?.rawBody;
  const sig = req.headers["stripe-signature"];
  const endpointSecret = STRIPE_CONNECT_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;

      if (session.payment_status === "paid") {
        fulfillPayment(session);
      }

      break;
    }

    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object;

      // Fulfill the purchase...
      fulfillPayment(session);

      break;
    }

    case "checkout.session.async_payment_failed": {
      const session = event.data.object;

      fulfillPayment(session);

      break;
    }

    case "account.updated": {
      const account = event.data.object;

      updateAccountStatus(account);
    }

    case "external_account.created": {
      const account = event.data.object;

      updateAccountStatus(account);
    }

    case "external_account.updated": {
      const account = event.data.object;
      updateAccountStatus(account);
    }
  }

  res.status(200).json({ success: true });
};
