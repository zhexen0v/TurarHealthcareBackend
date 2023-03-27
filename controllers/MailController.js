import Mail from "../models/Mail.js";
import Mailgun from 'mailgun-js';

const mailgun = () =>
     Mailgun({
          apiKey: '151cc9beef0236e04318248b2f62d0ba-d51642fa-1dd2342e',
          domain: 'sandbox1b441c945d6749fa99b16da47b3f1f3f.mailgun.org',
     });

export const sendMailToChairmanBlog = async (req, res) => {
     try {
          mailgun()
               .messages()
               .send(
                    {
                         from: `${req.body.senderData.email}`,
                         to: 'adilzhexenov@outlook.com',
                         subject: `Блог председателя | Сообщение от ${req.body.senderData.name} ${req.body.senderData.surname}`,
                         text: req.body.message,
                    },
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
          const newDocument = new Mail({
               senderData: req.body.senderData,
               message: req.body.message.trim()
          });
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