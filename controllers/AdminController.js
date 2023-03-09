import Admin from "../models/Admin.js";
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
     try {
          const errors = validationResult(req);
          if (!errors.isEmpty()){
               return res.status(400).json(errors.array());
          }
          const password = req.body.password;
          const salt = await bcrypt.genSalt(10);
          const hPassword = await bcrypt.hash(password, salt);

          const newDocument = new Admin({
               name: req.body.name,
               surname: req.body.surname,
               username: req.body.username,
               hashedPassword: hPassword
          });

          const newAdmin = await newDocument.save(); 

          const token = jwt.sign({
               _id: newAdmin._id
          }, 'adminkey', {
               expiresIn: '30m'
          });

          const { hashedPassword, ...adminData } = newAdmin._doc;

          res.json({
               ...adminData,
               token
          });
     } catch (error) {
          console.log(error);
          res.status(500).json({
               message: 'Failed to add new admin'
          });
     }
}

export const login = async (req, res) => {
     try {
          const admin = await Admin.findOne({username: req.body.username});
          if (!admin) {
               return res.status(404).json({
                    message: 'Admin not found'
               });
          };

          const isValidPassword = await bcrypt.compare(req.body.password, admin._doc.hashedPassword);
          if (!isValidPassword) {
               return res.status(400).json({
                    message: 'Incorrect username or password'
               });
          };

          const token = jwt.sign({
               _id: admin._id
          }, 'adminkey', {
               expiresIn: '30m'
          });

          const { hashedPassword, ...adminData } = admin._doc;

          res.json({
               ...adminData,
               token
          });
     } catch (error) {
          console.log(error);
          res.status(500).json({
               message: 'Failed to log in admin'
          });
     }
}