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
          const category = await DocumentCategory.findOne({link: req.params.link}).populate('documents').exec();
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

export const addNewDocument = async (req, res) => {
     try {
          const newDoc = new Document({
               name: {
                    kz: req.body.kzName.trim(),
                    ru: req.body.ruName.trim(),
                    en: req.body.enName.trim()
               },
               documentCategory: req.body.documentCategory,
               filename: req.file.originalname
          });
          const newDocument = await newDoc.save();

          const updatedDocumentCategory = await DocumentCategory.findByIdAndUpdate(
               req.body.documentCategory,
               {
                    $addToSet: {documents: newDocument._id}
               }
          );

          if (!updatedDocumentCategory) {
               res.status(400).json({
                    message: 'Can not update category'
               });
          }

          res.json(newDocument);
     } catch (error) {
          console.log(error);
          res.status(500).json({
               message: error.message
          });
     }
}

export const updateDocument = async (req, res) => {
     try {
          const beforeUpdate = await Document.findById(req.params.id);
          let updatedObject = {
               name: {
                    kz: req.body.kzName.trim(),
                    ru: req.body.ruName.trim(),
                    en: req.body.enName.trim()
               },
               documentCategory: req.body.documentCategory
          }

          if (req.file) {
               updatedObject.filename = req.file.originalname;
          }

          const updatedDocument = await Document.findByIdAndUpdate(
               req.params.id,
               updatedObject
          );

          if (updatedDocument.matchedCount === 0) {
               res.status(404).json({
                    message: 'Document not found'
               });
          }

          if (beforeUpdate.documentCategory !== req.body.documentCategory) {
               const updatedNewCategory = await DocumentCategory.findByIdAndUpdate(
                    req.body.documentCategory,
                    {
                         $addToSet: {documents: beforeUpdate._id}
                    }
               );
     
               if (!updatedNewCategory) {
                    res.status(404).json({
                         message: 'Couldn`t update new category'
                    });
               }
     
               const updatedPreviousCategory = await DocumentCategory.findByIdAndUpdate(
                    beforeUpdate.documentCategory,
                    {
                         $pull: {documents: beforeUpdate._id}
                    }
               );
     
               if (!updatedPreviousCategory) {
                    res.status(404).json({
                         message: 'Couldn`t update new category'
                    });
               }
          }

          res.json(updatedDocument);
     } catch (error) {
          console.log(error);
          res.status(500).json({
               message: error.message
          });
     }
}

export const deleteDocument = async (req, res) => {
     try {
          const doc = await Document.findById(req.params.id);
          const deletedDocument = await Document.findByIdAndDelete(req.params.id);
          if (!deletedDocument) {
               res.status(404).json({
                    message: 'Document did not delete'
               });
          }

          const updatedCategory = await DocumentCategory.findByIdAndUpdate(
               doc.documentCategory,
               {
                    $pull: {documents: doc._id}
               }
          );

          if (!updatedCategory) {
               res.status(400).json({
                    message: 'Category did not update'
               });
          }
          res.json({
               message: 'Document successfully deleted'
          });
     } catch (error) {
          console.log(error);
          res.status(500).json({
               message: error.message
          })
     }
}