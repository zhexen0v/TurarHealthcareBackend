import Document from "../models/Document.js";
import DocumentCategory from "../models/DocumentCategory.js";
import { validationResult } from "express-validator";
import { ObjectId } from "mongodb";

export const addNewDocumentCategory = async (req, res) => {
     try {
          const errors = validationResult(req);
          if (!errors.isEmpty()){
               return res.status(400).json(errors.array());
          }

          const newDoc = new DocumentCategory({
               title: req.body.title,
               link: req.body.link.trim()
          });

          const newDocumentCategory = await newDoc.save();
          res.json(newDocumentCategory);
     } catch (error) {
          console.log(error);
          res.status(500).json({
               message: error.message
          })
     }
}

export const getAllDocumentCategories = async (req, res) => {
     try {
          const allCategories = await DocumentCategory.find().populate('documents').exec();
          if (!allCategories) {
               res.status(400).json({
                    message: 'Categories not found'
               });
          }
          res.json(allCategories);
     } catch (error) {
          console.log(error);
          res.status(500).json({
               message: error.message
          })
     }
}

export const getDocumentCategoryByLink = async (req, res) => {
     try {
          const category = await DocumentCategory.findOne({link: req.params.link});
          if (!category) {
               res.status(404).json({
                    message: 'Category not found'
               });
          }
          res.json(link);
     } catch (error) {
          console.log(error);
          res.status(500).json({
               message: error.message
          })
     }
}

export const updateDocumentCategory = async (req, res) => {
     try {
          const errors = validationResult(req);
          if (!errors.isEmpty()){
               return res.status(400).json(errors.array());
          }

          const updatedDocumentCategory = await DocumentCategory.findByIdAndUpdate(
               req.params.id,
               {
                    title: req.params.title,
                    link: req.params.link.trim()
               }
          );

          if (updatedDocumentCategory.matchedCount === 0) {
               res.status(404).json({
                    message: 'Document category not found'
               });
          }

          res.json(updatedDocumentCategory);
     } catch (error) {
          console.log(error);
          res.status(500).json({
               message: error.message
          });
     }
}

export const deleteDocumentCategory = async (req, res) => {
     try {
          const deletedCategory = await DocumentCategory.findByIdAndDelete(req.params.id);
          if (deletedCategory.deletedCount !== 1) {
               res.status(400).json({
                    message: 'Category not deleted'
               });
          }
          const deletedDocuments = await Document.deleteMany({documentCategory: ObjectId(req.params.id)});
          if (deletedDocuments.deletedCount < 1) {
               res.status(400).json({
                    message: 'Documents not deleted'
               });
          }
     } catch (error) {
          console.log(error);
          res.status(500).json({
               message: error.message
          })
     }
}