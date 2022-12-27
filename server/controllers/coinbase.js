const config = require("../config/main");
const { website_url } = require("../config/main");

const User = require("../models/user");
const Transactions = require("../models/transactions");

const coinbase = require("coinbase-commerce-node");
const Client = coinbase.Client;
Client.init(config.coinbaseApiKey);
const Charge = coinbase.resources.Charge;

exports.webhook = (req, res, next) => {};

exports.createCharge = async (req, res, next) => {
  // console.log(
  //   // req.path,
  //   req.body
  // );
  var chargeData = {
    name: "Donation",
    description: "Make donation",
    local_price: {
      amount: req?.body?.amount,
      currency: "USD",
    },
    pricing_type: "fixed_price",
  };

  //TODO get the reciever from the req.body.reciever
  const slug = decodeURI(req.body.location.split("/")[3]);

  Charge.create(chargeData, async function (error, response) {
    // console.log(error);
    console.log("response", response, response.hosted_url);

    const user = await User.findOne({ slug });

    if (response?.hosted_url) {
      const Transaction = await Transactions.create({
        sender: req?.body?.sender?._id,
        reciever: user._id || req.body.reciever._id,
        type: "donation",
        currency: "usd",
        paymentid: response.id,
        paymentprovider: "coinbase",
        amount: +req?.body?.amount,
      });
      console.log(Transaction);

      res.json({ url: response.hosted_url });
    }
    // res.redirect(303, session.url);
  });
};
