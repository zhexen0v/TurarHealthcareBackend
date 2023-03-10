import Partner from "../models/Partner.js";
import { validationResult } from "express-validator";

export const getAllPartners = async (req, res) => {
     try {
          const partners = await Partner.find({});
          if (!partners) {
               res.status(400).json({
                    message: error.message
               });
          }
          res.json(partners);
     } catch (error) {
          console.log(error);
          res.status(500).json({
               error: error.message
          });  
     }
}

export const addNewPartner = async (req, res) => {
     try {
          const errors = validationResult(req);
          if (!errors.isEmpty()){
               return res.status(400).json(errors.array());
          }

          const newDocument = new Partner({
               kzTitle: req.body.kz,
               ruTitle: req.body.ru,
               imageUrl: req.file.filename
          });

          const newPartner = await newDocument.save();
          res.json(newPartner);
     } catch (error) {
          console.log(error);
          res.status(500).json({
               message: error.message
          });
     }
} 