import Generalnformation from "../models/Generalnformation.js";
import { validationResult } from "express-validator";
import { deleteFileFromFolder } from "../utils/utils.js";

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
                    phoneNumber: req.body.phoneNumber.trim(),
                    address: req.body.address,
                    mail: req.body.mail.trim(),
                    firstTitle: req.body.firstTitle.trim(),
                    secondTitle: req.body.secondTitle,
                    additionalTitle: req.body.additionalTitle,
                    instagramLink: req.body.instagramLink.trim(),
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

export const changeBackgroundImage = async (req, res) => {
     try {
          const beforeUpdate = await Generalnformation.findOne();
          const updatedBackground = await Generalnformation.updateOne({}, {
               bgImage: Buffer.from(req.file.originalname, 'latin1').toString('utf8')
          });
          if (!updatedBackground) {
               res.status(400).json({
                    message: 'Background not found'
               });  
          }

          deleteFileFromFolder('backgrounds', beforeUpdate.bgImage);

          res.json(updatedBackground);
     } catch (error) {
          console.log(error);
          res.status(500).json({
               message: error.message
          })
     }
}

export const changeHomeBackgroundImage = async (req, res) => {
     try {
          const beforeUpdate = await Generalnformation.findOne();
          const updatedHomeBackground = await Generalnformation.updateOne({}, {
               homeBgImage: Buffer.from(req.file.originalname, 'latin1').toString('utf8')
          });
          if (!updatedHomeBackground) {
               res.status(400).json({
                    message: 'Background not found'
               });  
          }

          deleteFileFromFolder('backgrounds', beforeUpdate.homeBgImage);

          res.json(updatedHomeBackground);
     } catch (error) {
          console.log(error);
          res.status(500).json({
               message: error.message
          })
     }
}

export const changeListOfNumbers = async (req, res) => {
     try {
          const updatedListOfNumbers = await Generalnformation.updateOne({}, {listOfNumbers: req.file.filename});
          if (!updatedListOfNumbers) {
               res.status(400).json({
                    message: 'List of numbers not found'
               });  
          }
          res.json(updatedListOfNumbers);
     } catch (error) {
          console.log(error);
          res.status(500).json({
               message: error.message
          })
     }
}