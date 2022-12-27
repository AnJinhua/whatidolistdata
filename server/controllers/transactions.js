const Transactions = require("../models/transactions");
const User = require("../models/user");

// get all Transactions
exports.getTransactions = async (req, res) => {
  const receiverSlug = req.params.userSlug;
  const transactions = await Transactions.find({ receiverSlug }).sort({
    createdAt: -1,
  });

  res.status(200).json(transactions);
};

// get a single Transaction
exports.getTransaction = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such Transaction" });
  }

  const transaction = await Transactions.findById(id);

  if (!transaction) {
    return res.status(404).json({ error: "No such Transaction" });
  }

  res.status(200).json(transaction);
};

// create a new Transaction
exports.createTransaction = async (req, res) => {
  const slug = req.body.receiverSlug;

  // add to the database
  try {
    const user = await User.findOne({ slug: slug });
    const userId = user?._id;

    const transaction = await Transactions.create({
      sender: req.body.sender,
      senderName: req.body.senderName,
      senderAvatar: req.body.senderAvatar,
      receiver: userId,
      receiverSlug: req.body.receiverSlug,
      type: req.body.type,
      currency: req.body.currency,
      txHash: req.body.txHash,
      paymentProvider: req.body.paymentProvider,
      paymentMethod: req.body.paymentMethod,
      status: req.body.status,
      amount: req.body.amount,
    });

    res.status(200).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete a Transaction
exports.deleteTransaction = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such Transaction" });
  }

  const transaction = await Transactions.findOneAndDelete({ _id: id });

  if (!transaction) {
    return res.status(400).json({ error: "No such Transaction" });
  }

  res.status(200).json(transaction);
};

// delete all Transactions
exports.deleteAllTransactions = async (req, res) => {
  try {
    const transactions = await Transactions.deleteMany();

    res.status(200).json(transactions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// update a Transaction
exports.updateTransaction = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such Transaction" });
  }

  const transaction = await Transactions.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );

  if (!transaction) {
    return res.status(400).json({ error: "No such Transaction" });
  }

  res.status(200).json(transaction);
};
