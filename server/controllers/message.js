const Message = require("../models/message");
const config = require("../config/main");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");
const sendGridTransport = require("nodemailer-sendgrid-transport");
const { cloudinary } = require("../config/cloudinary");
const { MEDIA_CDN_URL } = require("../config/s3");

const {
  createMessageService,
  updateMessageService,
  deleteMessageService,
} = require("../services/message");

const handlebarOptions = {
  viewEngine: {
    partialsDir: path.resolve("./views/email-templates/notifications/"),
    defaultLayout: false,
  },
  viewPath: path.resolve("./views/email-templates/notifications/"),
};

const transporter = nodemailer.createTransport(
  sendGridTransport({
    auth: {
      api_key: config.SENDGRID_API,
    },
  })
);

transporter.use("compile", hbs(handlebarOptions));

//create message
exports.addNewMessage = async (req, res) => {
  const result = await createMessageService(req.body);
  res.status(result.statusCode).json(result.data);
};

//update message
exports.updateMessage = async (req, res) => {
  const result = await updateMessageService(req);
  res.status(result.statusCode).json(result.data);
};

//delete a message
exports.deleteMessage = async (req, res) => {
  const result = await deleteMessageService(req);
  res.status(result.statusCode).json(result.data);
};

//multiple image upload
exports.uploadMultipleImages = async (req, res) => {
  try {
    let imageBaseB64Array = req.body.imageFile;
    let multipleImageUpload = imageBaseB64Array.map(({ src }) =>
      cloudinary.uploader.upload(src)
    );
    let imageResponses = await Promise.all(multipleImageUpload);
    res.status(200).json(imageResponses);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.uploadS3 = async (req, res) => {
  try {
    const uploadedFile = req.files.file[0];

    if (!uploadedFile) {
      res.status(401).json({
        status: false,
        message: "File not uploaded",
      });
    } else {
      const resData = {
        location: uploadedFile.location,
        key: uploadedFile.key,
        cdnUrl: MEDIA_CDN_URL + "messenger/" + uploadedFile.key,
      };
      res.status(200).json(resData);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.uploadMultiS3 = async (req, res) => {
  try {
    const uploadedFile = req.files.file;

    if (!uploadedFile[0]) {
      res.status(401).json({
        status: false,
        message: "File not uploaded",
      });
    } else {
      const resData = uploadedFile.map((file) => {
        return {
          location: file.location,
          key: file.key,
          cdnUrl: MEDIA_CDN_URL + "messenger/" + file.key,
        };
      });

      res.status(200).json(resData);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

//audio upload api
exports.addNewMessageWithAudio = async (req, res) => {
  try {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "video",
          chunk_size: 6000000,
        },
        (error, result) => {
          if (error) {
            res.status(500).json(error);
            console.log("error on cloudinary upload", error);
          } else {
            res.status(200).json({ file: result });
          }
        }
      )
      .end(req.file.buffer);
  } catch (err) {
    res.status(500).json(err);
  }
};

//get all messeges
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
      deleted: { $ne: [req.params.userSlug] },
      blocked: { $ne: [req.params.userSlug] },
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
};

//get all messages ordered from latest to oldest and add pagination that returns 20 messages per page using req.query.page to get the next 20 messages
exports.getPaginatedMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
      deleted: { $ne: [req.params.userSlug] },
      blocked: { $ne: [req.params.userSlug] },
    })
      .sort({ createdAt: -1 })
      .skip(req.query.page * 20)
      .limit(20);
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
};

//get last message in a conversation
exports.getLastMessage = async (req, res) => {
  try {
    //get only the last recent message
    const messages = await Message.find({
      conversationId: req.params.conversationId,
      deleted: { $ne: [req.params.userSlug] },
      blocked: { $ne: [req.params.userSlug] },
    })
      .sort({ createdAt: -1 })
      .limit(1);

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
};
//get message count
exports.getMessageCount = async (req, res) => {
  try {
    //get only the count of messages;
    const messages = await Message.count({
      conversationId: req.params.conversationId,
      deleted: { $ne: [req.params.userSlug] },
      blocked: { $ne: [req.params.userSlug] },
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
};

//get last five messages in a conversation
exports.getLastFiveMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
      deleted: { $ne: [req.params.userSlug] },
      blocked: { $ne: [req.params.userSlug] },
    })
      .sort({ createdAt: -1 })
      .limit(5);
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
};

//get unread message of userSlug
exports.getUnreadMessagesOfUser = async (req, res) => {
  try {
    const messages = await Message.find({
      reciever: req.params.userSlug,
      deleted: { $ne: [req.params.userSlug] },
      blocked: { $ne: [req.params.userSlug] },
      read: false,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
};

//get unread messages
exports.getUnreadMessagesofConversation = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
      reciever: req.params.userSlug,
      deleted: { $ne: [req.params.userSlug] },
      blocked: { $ne: [req.params.userSlug] },
      read: false,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
};

//notify offline users
exports.notifyOfflineUsers = async (req, res) => {
  const { senderName, recieverEmail, message, recieverName, url } = req.body;
  const mailOptions = {
    from: `${senderName} via what i do <no-reply@whatido.app>`,
    to: recieverEmail,
    subject: `${senderName}, awaits your response`,
    template: "message",
    context: {
      senderName: senderName,
      recieverName: recieverName,
      message: message,
      url: url,
    },
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("In error of nodemailer");
      res.status(500).json(error);
    } else {
      console.log(`email notification sent to ${recieverEmail}`);
      res.status(200).json(info);
    }
  });
};

//send zoom email notificiation
exports.sendZoomEmailNotification = async (req, res) => {
  const { senderName, recieverEmail, message, recieverName, url, baseUrl } =
    req.body;
  const mailOptions = {
    from: `${senderName} via what.i.do <no-reply@whatido.app>`,
    to: recieverEmail,
    subject: `${senderName}, invited you to a zoom call`,
    template: "zoomNotification",
    context: {
      senderName: senderName,
      recieverName: recieverName,
      message: message,
      url: url,
      baseUrl: baseUrl,
    },
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("In error of nodemailer");
      res.status(500).json(error);
    } else {
      console.log(`Email Notification sent to ${recieverEmail}`);
      res.status(200).json(info);
    }
  });
};

exports.sendAudioRoomEmailNotification = async (req, res) => {
  const {
    senderName,
    recieverEmail,
    message,
    recieverName,
    url,
    baseUrl,
    roomTitle,
  } = req.body;
  const mailOptions = {
    from: `${senderName} via whatido <no-reply@whatido.app>`,
    to: recieverEmail,
    subject: `${senderName}, invited you to their audio room`,
    template: "audioRoomNotification",
    context: {
      senderName: senderName,
      recieverName: recieverName,
      message: message,
      url: url,
      baseUrl: baseUrl,
      roomTitle: roomTitle,
    },
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("In error of nodemailer");
      res.status(500).json(error);
    } else {
      console.log(`Email Notification sent to ${recieverEmail}`);
      res.status(200).json(info);
    }
  });
};

//send story repy notification
exports.sendStoryReplyNotification = async (req, res) => {
  const { senderName, recieverEmail, message, recieverName, url, baseUrl } =
    req.body;
  const mailOptions = {
    from: `${senderName} via whatido.app <no-reply@donnislist.com>`,
    to: recieverEmail,
    subject: `${senderName}, repied to your story`,
    template: "storyReply",
    context: {
      senderName: senderName,
      recieverName: recieverName,
      message: message,
      url: url,
      baseUrl: baseUrl,
    },
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("In error of nodemailer");
      res.status(500).json(error);
    } else {
      console.log(`Email Notification sent to ${recieverEmail}`);
      res.status(200).json(info);
    }
  });
};
