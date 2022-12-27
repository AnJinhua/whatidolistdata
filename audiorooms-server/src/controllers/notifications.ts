import nodemailer from "nodemailer";
import hbs, { NodemailerExpressHandlebarsOptions } from "nodemailer-express-handlebars";
const sendGridTransport = require("nodemailer-sendgrid-transport");
import path from "path";
import { SENDGRID_API_KEY } from "../config"
import { Request, Response } from 'express';


const handlebarOptions: NodemailerExpressHandlebarsOptions = {
    viewEngine: {
        partialsDir: path.resolve("./src/views/email-templates//"),
        defaultLayout: false,
    },
    viewPath: path.resolve("./src/views/email-templates/"),
};

const transporter = nodemailer.createTransport(
    sendGridTransport({
        auth: {
            api_key: SENDGRID_API_KEY,
        },
    })
);

transporter.use("compile", hbs(handlebarOptions));


const sendInviteEmail = async (req: Request, res: Response) => {
    const { senderName, receiverEmail, roomTitle, recieverName, url, message } =
        req.body;

    const mailOptions = {
        from: `${senderName} via what i do <no-reply@whatido.app>`,
        to: receiverEmail,
        subject: `${roomTitle} - Join the conversation on What I Do`,
        template: "audioRoomNotification",
        context: {
            senderName: senderName,
            recieverName: recieverName,
            roomTitle: roomTitle,
            url: url,
            message,
        },
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("In error of nodemailer");
            res.status(500).json(error);
        } else {
            console.log(`email notification sent to ${mailOptions.to}`);
            res.status(200).json(info);
        }
    });
};

export default {
    sendInviteEmail,
}