const Conversation = require("../models/conversation");
const Message = require("../models/message");
const {
  createConversationService,
  updateConversationService,
} = require("../services/conversation");

//conversation route
exports.createConversation = async (req, res) => {
  const result = await createConversationService(req);
  res.status(result.statusCode).json(result.data);
};

//update a conversation
exports.updateConversation = async (req, res) => {
  const result = await updateConversationService(req);
  res.status(result.statusCode).json(result.data);
};
//get all conversations by user id
exports.getAllConversations = async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.id] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
};

//get active conversations by id
exports.getActiveCoversation = async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.id] },
      deleted: { $ne: [req.params.id] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getBuggyConversations = async (req, res) => {
  try {
    //get all conversations that has null in members array
    const conversation = await Conversation.find({
      members: { $in: ["null"] },
    });
    // const conversation = await Conversation.find({
    //   members: { $in: [null] },
    // });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
};

//get ongoing conversations by id
exports.getOngoingCoversation = async (req, res) => {
  try {
    //find ongoing conversations and sort from latest to oldest
    const conversation = await Conversation.find({
      members: { $in: [req.params.id] },
      deleted: { $ne: [req.params.id] },
      archived: { $ne: [req.params.id] },
    }).sort({ updatedAt: -1 });

    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
};
exports.getPageOngoingCoversation = async (req, res) => {
  try {
    //find ongoing conversations and sort from latest to oldest
    const conversation = await Conversation.find({
      members: { $in: [req.params.id] },
      deleted: { $ne: [req.params.id] },
      archived: { $ne: [req.params.id] },
    })
      .sort({ updatedAt: -1 })
      .skip(req.query.page * 10)
      .limit(10);

    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
};
//get archived conversation
exports.getArchivedCoversation = async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.id] },
      archived: { $in: [req.params.id] },
      deleted: { $ne: [req.params.id] },
    });

    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
};

//check if conversations between two members exists
exports.findUsersConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
};
//get conversation by id
exports.getConversationById = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
};
//update conversation by taking req.body.archived and add to monogose archived array
exports.addArchiveConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findByIdAndUpdate(
      req.params.id,
      {
        $push: { archived: req.body.archived },
      },
      {
        new: true,
      }
    );

    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
};
//update archived conversation by removing req.body.archived from monogose archived array
exports.restoreArchiveConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { archived: req.body.archived },
      },
      {
        new: true,
      }
    );
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
};

//update conversation by taking req.body.blocked and add to monogose archived array
exports.blockConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findByIdAndUpdate(
      req.params.id,
      {
        $push: { blocked: req.body.blocked },
      },
      {
        new: true,
      }
    );

    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
};
//update archived conversation by removing req.body.blocked from monogose archived array
exports.unBlockConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { blocked: req.body.blocked },
      },
      {
        new: true,
      }
    );
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
};

//delete conversation from database by id
exports.deleteConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findByIdAndDelete(req.params.id);
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
};

//temprorary delete conversation

exports.tempDeleteConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findByIdAndUpdate(
      req.params.id,
      {
        $push: { deleted: req.body.deleted },
      },
      {
        new: true,
      }
    );
    // update conversation messages by adding deleted user to deleted array
    const messages = await Message.find({ conversationId: conversation._id });
    messages.forEach((message) => {
      message.deleted.push(req.body.deleted);
      message.save();
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
};

//function that removes req.body.restored from mongoose deleted and archived array
exports.restoreTempDeletedConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    conversation.deleted.pull(req.body.restored);
    conversation.archived.pull(req.body.restored);
    conversation.save();

    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
};
//function that permanently deletes conversation from database and find all messages of conversation_id and delete them
exports.permanentDeleteConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    const messages = await Message.find({ conversationId: conversation._id });
    messages.forEach((message) => {
      message.remove();
    });
    conversation.remove();
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
};
