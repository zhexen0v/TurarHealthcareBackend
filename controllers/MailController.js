import Mail from "../models/Mail.js";
import Mailgun from 'mailgun-js';
import request from "request";
import fs from 'fs';
import path from 'path';

const mailgun = Mailgun({
     apiKey: '151cc9beef0236e04318248b2f62d0ba-d51642fa-1dd2342e',
     domain: 'sandbox1b441c945d6749fa99b16da47b3f1f3f.mailgun.org',
});

export const sendMailToChairmanBlog = async (req, res) => {
     try {
          let data = {
               from: `${req.body.email.trim()}`,
               to: 'adilzhexenov@outlook.com',
               subject: `Блог председателя | Сообщение от ${req.body.name.trim()} ${req.body.surname.trim()}`,
               text: req.body.message.trim(),
          }
          
          if (req.files) {
               const tempFiles = [];
               req.files.forEach((file) => {
                    const fileContents = fs.readFileSync(file.path);
                    const fileBuffer = Buffer.from(fileContents);
                    const newFile = new mailgun.Attachment({
                         data: fileBuffer,
                         filename: file.filename
                    })
                    tempFiles.push(newFile);
               });
               data.attachment = tempFiles;
          }
          console.log(data);
          mailgun
               .messages()
               .send(
                    data,
                    (error, body) => {
                         if (error) {
                              console.log(error);
                              res.status(500).send({ message: 'Error in sending email' });
                         } else {
                              console.log(body);
                              console.log('Hello from sendMail!');
                              res.send({ message: 'Email sent successfully' });
                         }
                    }
          );
          
          /*
          const newDocument = new Mail({
               senderData: {
                    name: req.body.name.trim(),
                    surname: req.body.surname.trim(),
                    email: req.body.email.trim()
               },
               message: req.body.message.trim()
          });
          await newDocument.save();
          */
     } catch (err) {
          console.log(err);
          res.status(500).json({
               message: err.message
          });
     }
}

export const getAllMailsWithoutAnswers = async (req, res) => {
     try {
          const mails = await Mail.find({answer: {$exists: false}});
          res.json(mails);
     } catch (err) {
          console.log(err);
          res.status(500).json({
               message: err.message
          });
     }
}