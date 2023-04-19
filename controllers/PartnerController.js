import Partner from "../models/Partner.js";
import { validationResult } from "express-validator";

export const getAllPartners = async (req, res) => {
     try {
          const partners = await Partner.find({}).sort({orderNumber: 1});
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
               enTitle: req.body.en,
               imageUrl: req.file.filename
          });

          if (req.body.link) {
               newDocument.link = req.body.link;
          }

          const newPartner = await newDocument.save();
          res.json(newPartner);
     } catch (error) {
          console.log(error);
          res.status(500).json({
               message: error.message
          });
     }
} 

export const updatePartner = async (req, res) => {
     try {
          const errors = validationResult(req);
          if (!errors.isEmpty()){
               return res.status(400).json(errors.array());
          }

          let updatedObj = {
               kzTitle: req.body.kz,
               ruTitle: req.body.ru,
               enTitle: req.body.en,
          }
          if (req.body.link) {
               updatedObj.link = req.body.link;
          }
          if (req.file) {
               updatedObj.imageUrl = req.file.filename;
          }

          const updatedPartner = await Partner.findByIdAndUpdate(
               req.body.id,
               updatedObj
          );

          if (updatePartner.matchedCount === 0) {
               res.status(400).json({
                    message: 'Partner not found'
               });
          }

          res.json(updatedPartner);
     } catch (error) {
          console.log(error);
          res.status(500).json({
               message: error.message
          });
     }
} 

export const deletePartner = async (req, res) => {
     try {
          const deletedPartner = await Partner.findById(req.params.id);
          const partners = await Partner.find({orderNumber: {$gt: deletedPartner.orderNumber}});
          for (let i = 0; i < partners.length; i++) {
               await Partner.findByIdAndUpdate(
                    partners[i]._id,
                    {
                         $inc: {orderNumber: -1}
                    }
               )
          }
          await Partner.findByIdAndDelete(req.params.id);
          res.json(deletedPartner);
     } catch (error) {
          console.log(error);
          res.status(500).json({
               message: error.message
          })
     }
}

export const incrementOrderOfPartner = async (req, res) => {
     try {
          await Partner.findByIdAndUpdate(
               req.params.id,
               {
                    $inc: {orderNumber: -1} 
               }
          )
          const partner = await Partner.findById(req.params.id);
          await Partner.updateOne({$and: [
               {_id: {$ne: partner._id}},
               {orderNumber: partner.orderNumber}
          ]}, {
               $inc: {orderNumber: 1}
          });
          res.json(partner);
     } catch (error) {
          console.log(error);
          res.status(500).json({
               message: error.message
          });
     }
}

export const decrementOrderOfPartner = async (req, res) => {
     try {
          await Partner.findByIdAndUpdate(
               req.params.id,
               {
                    $inc: {orderNumber: 1} 
               }
          )
          const partner = await Partner.findById(req.params.id);
          await Partner.updateOne({$and: [
               {_id: {$ne: partner._id}},
               {orderNumber: partner.orderNumber}
          ]}, {
               $inc: {orderNumber: -1}
          });
          res.json(partner);
     } catch (error) {
          console.log(error);
          res.status(500).json({
               message: error.message
          });
     }
}
