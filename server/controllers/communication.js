// const mailgun = require('../config/mailgun');
const nodemailer = require("nodemailer");
const config = require("../config/main");
const sendGridTransport = require("nodemailer-sendgrid-transport");

exports.sendContactForm = (req, res /* next */) => {
  const transporter = nodemailer.createTransport(
    sendGridTransport({
      auth: {
        api_key: config.SENDGRID_API,
      },
    })
  );

  const PersonalTransporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: config.gmailEmail,
      pass: config.gmailPassword,
    },
  });
  /* email to site admin */
  let html =
    "Hello Donnies list Admin, <br> Someone contacted you on Donnies list";
  html += "<p>Following is user information:</p>";
  html += "<p>-----------------------</p>";
  html += `<p>First Name : ${req.body.firstName}</p>`;
  html += `<p>Last Name : ${req.body.lastName}</p>`;
  html += `<p>Subject : ${req.body.subject}</p>`;
  html += `<p>Email : ${req.body.emailAddress}</p>`;
  html += `<p>Message : ${req.body.message}</p>`;
  html += "<p>-----------------------</p>";
  html += "<p><br>Thank you, Team Donnies List</p>";

  /* email to contact request person */
  let html1 = `Hello ${req.body.firstName}, <br> Thank you for contacting donnieslisthelp.`;
  html1 +=
    "<br><p>We will contact you soon! <br>Thank you, Team Donnies List</p>";
  const mailOptions = {
    from: req.body.emailAddress,
    to: "donnieslisthelp@gmail.com",
    subject: "Contact request @donnislist.com",
    html: html,
  };
  const mailOptions1 = {
    from: "Donnies list <no-reply@whatido.app>",
    to: req.body.emailAddress,
    subject: "Donnies list contact request",
    html: html1,
  };

  PersonalTransporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("In error of nodemailer");
      res.status(500).json(error);
    } else {
      console.log(`Email Notification sent to donnieslisthelp`);
    }
  });

  transporter.sendMail(mailOptions1, (error, info) => {
    if (error) {
      console.log("In error of nodemailer");
      res.status(500).json(error);
    } else {
      console.log(`Email Notification sent to ${req.body.emailAddress}`);
    }
  });

  return res.status(200).json({
    message: "Your email has been sent. We will be in touch with you soon.",
  });
};
