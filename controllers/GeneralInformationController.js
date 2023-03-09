import Generalnformation from "../models/Generalnformation.js";
import { validationResult } from "express-validator";

export const initialInsert = async (req, res) => {
     try {
          const initialInfo = new Generalnformation({
               phoneNumber: req.body.phone.trim(),
               address: req.body.address,
               mail: req.body.mail.trim(),
               firstTitle: req.body.firstTitle.trim(),
               secondTitle: req.body.secondTitle,
               additionalTitle: req.body.additionalTitle,
               bgImage: req.body.image    
          });
          const newInfo = await initialInfo.save();
          res.json(newInfo);
     } catch (error) {
          console.log(error);
          res.json({
               message: error.message
          });
     }
}

export const updateInfo = async (req, res) => {
     try {
          const errors = validationResult(req);
          if (!errors.isEmpty()){
               return res.status(400).json(errors.array());
          }
          const updatedGeneralInformation = await Generalnformation.updateOne({}, 
               {
                    phoneNumber: req.body.phone.trim(),
                    address: req.body.address,
                    mail: req.body.mail.trim(),
                    firstTitle: req.body.firstTitle.trim(),
                    secondTitle: req.body.secondTitle,
                    additionalTitle: req.body.additionalTitle,
                    instagramLink: req.body.instagram,
                    facebookLink: req.body.facebook,
                    bgImage: req.body.image    
               }); 
          if (!updatedGeneralInformation) {
               return res.status(400).json({
                    message: 'Error during updating data'
               });
          }        
          res.json(updatedGeneralInformation);
     } catch (error) {
          console.log(error);
          res.status(500).json({
               message: error.message
          });
     }
}

export const showGeneralInformation = async (req, res) => {
     try {
          const generalInfo = await Generalnformation.findOne();
          res.json(generalInfo);
     } catch (error) {
          console.log(error);
          res.status(500).json({
               message: error.message
          })
     }
}