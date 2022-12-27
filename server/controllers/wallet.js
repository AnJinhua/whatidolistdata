const Wallet = require("../models/wallet");

// get all Wallets
exports.getWallets = async (req, res) => {
  const wallets = await Wallet.find({}).sort({ createdAt: -1 });

  res.status(200).json(wallets);
};

// get a single Wallet
exports.getWallet = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such Wallet" });
  }

  const wallet = await Wallet.findById(id);

  if (!wallet) {
    return res.status(404).json({ error: "No such Wallet" });
  }

  res.status(200).json(wallet);
};

// create a new Wallet
exports.createWallet = async (req, res) => {
  //   const body = req.body;

  // add to the database
  try {
    const wallet = await Wallet.create(req.body);
    res.status(200).json(wallet);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete a Wallet
exports.deleteWallet = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such Wallet" });
  }

  const wallet = await Wallet.findOneAndDelete({ _id: id });

  if (!wallet) {
    return res.status(400).json({ error: "No such Wallet" });
  }

  res.status(200).json(wallet);
};

// update a Wallet
exports.updateWallet = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such Wallet" });
  }

  const wallet = await Wallet.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );

  if (!wallet) {
    return res.status(400).json({ error: "No such Wallet" });
  }

  res.status(200).json(wallet);
};

// add balance to Wallet
exports.addBalanceWallet = async (req, res) => {
  const user = req.body.userId;
  const amount = roundTo(Number(req.body.amount));

  if (!mongoose.Types.ObjectId.isValid(user)) {
    return res.status(400).json({ error: "No such Wallet" });
  }

  // const wallet = await Wallet.findById(id);

  const wallet = await Wallet.findOne({ user });

  if (!wallet) {
    return res.status(400).json({ error: "No such Wallet" });
  }

  wallet.balance = Number(wallet.balance) + amount;

  return wallet.save((err) => {
    if (err) {
      return res.json({
        success: false,
        error,
      });
    }
    return res.json({
      success: true,
    });
  });
};

// add balance to Wallet
exports.getBalanceWallet = async (req, res) => {
  const user = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(user)) {
    return res.status(400).json({ error: "No such Wallet" });
  }

  const wallet = await Wallet.findOne({ user });

  if (!wallet) {
    const newWallet = await Wallet.create({ user, balance: 0 });
    return res.status(200).json(newWallet);
  }

  return res.status(200).json(Wallet);
};

function roundTo(n, digits = 2) {
  var negative = false;
  if (digits === undefined) {
    digits = 0;
  }
  if (n < 0) {
    negative = true;
    n = n * -1;
  }
  var multiplicator = Math.pow(10, digits);
  n = parseFloat((n * multiplicator).toFixed(11));
  n = (Math.ceil(n) / multiplicator).toFixed(2);
  if (negative) {
    n = (n * -1).toFixed(2);
  }
  return +n;
}
