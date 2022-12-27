const PaystackModel = require("../models/paystack");
const Transactions = require("../models/transactions");
const User = require("../models/user");
const { PAYSTACK_CONNECTION_API_KEY } = require("../config/main");
const paystack = require("paystack-api")(PAYSTACK_CONNECTION_API_KEY);
const axios = require("axios");
const crypto = require("crypto");

exports.createPaystackAccount = async (req, res) => {
  const slug = req?.body?.userSlug;
  const params = {
    business_name: `${req?.body?.firstName} ${req?.body?.lastName}`,
    settlement_bank: req?.body?.bank_code,
    account_number: req?.body?.bank_account,
    percentage_charge: 10,
  };

  const paystackUser = await PaystackModel.findOne({ slug });

  if (paystackUser?.slug === slug) {
    res.send({ message: "Account already exists" });
  } else {
    const user = await User.findOne({ slug });

    let verificationResponse;
    await paystack.verification
      .resolveAccount({
        account_number: params?.account_number,
        bank_code: params?.settlement_bank,
      })
      .then(function (body) {
        verificationResponse = body;
      })
      .catch(function (error) {
        res.send(error);
      });

    if (verificationResponse?.status) {
      let paystackAccount;
      await paystack.subaccount
        .create(params)
        .then(function (body) {
          paystackAccount = body;
        })
        .catch(function (error) {
          res.send(error);
        });

      const newPaystackAccount = new PaystackModel({
        user: user?._id,
        slug: slug,
        paystack_acct_id: paystackAccount?.data?.subaccount_code,
      });

      await newPaystackAccount.save();

      res.send(paystackAccount);
    }
  }
};

exports.getPaystackAccount = async (req, res) => {
  const slug = req.params?.userSlug;

  const paystackUser = await PaystackModel.findOne({ slug });

  let paystackAccount;
  await paystack.subaccount
    .get({ id: paystackUser?.paystack_acct_id })
    .then(function (body) {
      paystackAccount = body;
    })
    .catch(function (error) {
      res.send(error);
    });

  res.send(paystackAccount);
};

exports.updatePaystackAccount = async (req, res) => {
  const slug = req?.body?.userSlug;
  const paystackUser = await PaystackModel.findOne({ slug });

  const params = {
    id: paystackUser?.paystack_acct_id,
    settlement_bank: req?.body?.bank_code,
    account_number: req?.body?.bank_account,
  };

  if (paystackUser?.slug === slug) {
    let verificationResponse;
    await paystack.verification
      .resolveAccount({
        account_number: params?.account_number,
        bank_code: params?.settlement_bank,
      })
      .then(function (body) {
        verificationResponse = body;
      })
      .catch(function (error) {
        res.send(error);
      });

    if (verificationResponse?.status) {
      let paystackAccount;
      await paystack.subaccount
        .update(params)
        .then(function (body) {
          paystackAccount = body;
        })
        .catch(function (error) {
          res.send(error);
        });

      res.send(paystackAccount);
    }
  }
};

exports.deletePaystackAccount = async (req, res) => {
  const slug = req.params?.userSlug;

  try {
    await PaystackModel.findOneAndDelete({ slug });
    res.status(200).json({ status: "success" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: "failed" });
  }
};

exports.createPaymentCheckout = async (req, res) => {
  let amount, url, txReference, verificationResponse;

  await axios
    .get(
      `https://api.exchangerate.host/convert?from=USD&to=NGN&amount=${req?.body?.amount}`
    )
    .then((response) => {
      amount = response?.data?.result;
    })
    .catch((error) => {
      console.log(error);
    });

  // create a transaction
  await paystack.transaction
    .initialize({
      amount: parseInt(amount) * 100,
      email: req?.body?.sender?.email,
      subaccount: req?.body?.account,
    })
    .then(function (body) {
      url = body?.data?.authorization_url;
      txReference = body?.data?.reference;
    })
    .catch(function (error) {
      console.log(error);
    });

  // verify transaction
  await paystack.transaction
    .verify({
      reference: txReference,
    })
    .then(function (body) {
      verificationResponse = body;
    })
    .catch(function (error) {
      console.log(error);
    });

  if (verificationResponse?.status) {
    const slug = decodeURI(req.body.location.split("/")[3]);
    const user = await User.findOne({ slug });

    const senderName = `${req?.body?.sender?.profile?.firstName} ${req?.body?.sender?.profile?.lastName}`;

    await Transactions.create({
      sender: req?.body?.sender?._id,
      senderName: senderName,
      senderAvatar: req?.body?.sender?.imageUrl?.cdnUrl,
      receiver: user?._id,
      receiverSlug: slug,
      type: "donation",
      currency: "NGN",
      paymentId: verificationResponse?.data?.id,
      paymentProvider: "paystack",
      paymentMethod: "card",
      amount: amount,
    });

    res.status(201).json({ url: url });
  }
};

exports.paystackWebhook = async (req, res) => {
  const hash = crypto
    .createHmac("sha512", PAYSTACK_CONNECTION_API_KEY)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (hash == req.headers["x-paystack-signature"]) {
    // Retrieve the request's body
    const event = req.body;
    // Do something with event
    if (req?.body?.event === "charge.success") {
      await Transactions.findOneAndUpdate(
        { paymentId: req?.body?.data?.id },
        {
          $set: { status: "paid" },
        }
      );
    }
  }
  res.send(200);
};
