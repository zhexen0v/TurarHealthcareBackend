import Mail from "../models/Mail.js";
import Mailgun from 'mailgun-js';
import fs from 'fs';
import 'dotenv/config';

const mailgun = Mailgun({
     apiKey: process.env.APIKEY,
     domain: process.env.DOMAIN,
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

                              res.send({ message: 'Email sent successfully' });
                         }
                    }
          );
          const newDocument = new Mail({
               senderData: {
                    name: req.body.name.trim(),
                    surname: req.body.surname.trim(),
                    email: req.body.email.trim()
               },
               message: req.body.message.trim(),
               access: false
          });
          if (req.files) {
               const namesOfFiles = [];
               req.files.forEach(file => {
                    namesOfFiles.push(file.filename);
               });
               newDocument.files = namesOfFiles;
          }
          await newDocument.save();
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

export const getAllMailsWithAnswers = async (req, res) => {
     try {
          const mails = await Mail.find({answer: {$exists: true}});
          res.json(mails);
     } catch (err) {
          console.log(err);
          res.status(500).json({
               message: err.message
          });
     }
}

export const getAllMailsWithAccess = async (req, res) => {
     try {
          const mails = await Mail.find({access: true}).sort({createdAt: -1});
          res.json(mails);
     } catch (err) {
          console.log(err);
          res.status(500).json({
               message: err.message
          });
     }
}

export const answerToMail = async (req, res) => {
     try {
          const updatedMail = await Mail.findByIdAndUpdate(
               req.params.id,
               {
                    $set: {answer: req.body.answer}
               }
          )
          if (!updatedMail) {
               res.status(404).json({
                    message: 'Mail not found'
               })
          }
          res.json(updatedMail);
     } catch (err) {
          console.log(err);
          res.status(500).json({
               message: err.message
          });
     }
}

export const showMail = async (req, res) => {
     try {
          const updatedMail = await Mail.findByIdAndUpdate(
               req.params.id,
               {
                    access: true
               }
          )
          if (!updatedMail) {
               res.status(404).json({
                    message: 'Mail not found'
               })
          }
          res.json(updatedMail);
     } catch (error) {
          console.log(err);
          res.status(500).json({
               message: err.message
          });
     }
}

export const hideMail = async (req, res) => {
     try {
          const updatedMail = await Mail.findByIdAndUpdate(
               req.params.id,
               {
                    access: false
               }
          )
          if (!updatedMail) {
               res.status(404).json({
                    message: 'Mail not found'
               })
          }
          res.json(updatedMail);
     } catch (error) {
          console.log(err);
          res.status(500).json({
               message: err.message
          });
     }
}

export const deleteMail = async (req, res) => {
     try {
          await Mail.findByIdAndDelete(req.params.id);
          res.json({
               message: 'Mail deleted'
          })
     } catch (err) {
          console.log(err);
          res.status(500).json({
               message: err.message
          })
     }
}