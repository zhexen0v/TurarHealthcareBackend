import { assign } from "nodemailer/lib/shared/index.js";
import Document from "../models/Document.js";
import NestedPage from "../models/NestedPage.js";
import PagePart from "../models/PagePart.js";
import { deleteFileFromFolder } from "../utils/utils.js";
/*
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
                    title: req.body.title,
                    link: req.body.link.trim()
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
*/
export const addNewDocument = async (req, res) => {
     try {
          const newDoc = new Document({
               name: {
                    kz: req.body.kzName.trim(),
                    ru: req.body.ruName.trim(),
                    en: req.body.enName.trim()
               },
               pageId: req.body.pageId,
               filename: Buffer.from(req.file.originalname, 'latin1').toString('utf8') 
          });
          const newDocument = await newDoc.save();

          const updatedNestedPage = await NestedPage.findByIdAndUpdate(
               req.body.pageId,
               {
                    $addToSet: {documents: newDocument._id}
               }
          );

          if (!updatedNestedPage) {
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
               pageId: req.body.pageId
          }

          if (req.file) {
               deleteFileFromFolder('documents', beforeUpdate.filename);
               updatedObject.filename = Buffer.from(req.file.originalname, 'latin1').toString('utf8');
          }

          const updatedDocument = await Document.findByIdAndUpdate(
               req.params.id,
               updatedObject
          );

          if (!updatedDocument) {
               res.status(404).json({
                    message: 'Document not found'
               });
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
          const beforeDelete = await Document.findById(req.params.id);
          try {
               await Document.findByIdAndDelete(req.params.id);
          } catch (error) {
               console.log(error);
               res.status(500).json({
                    message: error.message
               });
          }
          

          const updatedCategory = await NestedPage.findByIdAndUpdate(
               beforeDelete.pageId,
               {
                    $pull: {documents: beforeDelete._id}
               }
          );

          if (!updatedCategory) {
               res.status(400).json({
                    message: 'Category did not update'
               });
          }

          deleteFileFromFolder('documents', beforeDelete.filename);

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

export const showDocumentsByPage = async (req, res) => {
     try {
          const documents = await Document.find({pageId: req.params.id});
          if (!documents) {
               res.status(400).json({
                    message: 'Documents not found'
               });
          }
          res.json(documents);
     } catch (error) {
          console.log(error);
          res.status(500).json({
               message: error.message
          })
     }
}

export const addNewDocumentOfPagePart = async (req, res) => {
     try {
          const newDoc = new Document({
               name: {
                    kz: req.body.kzName.trim(),
                    ru: req.body.ruName.trim(),
                    en: req.body.enName.trim()
               },
               pagePartId: req.body.pageId,
               filename: Buffer.from(req.file.originalname, 'latin1').toString('utf8') 
          });
          const newDocument = await newDoc.save();

          await PagePart.findByIdAndUpdate(
               req.body.pageId,
               {
                    $addToSet: {documents: newDocument._id}
               }
          );

          res.json(newDocument);
     } catch (error) {
          console.log(error);
          res.status(500).json({
               message: error.message
          });
     }
}

export const updateDocumentOfPagePart = async (req, res) => {
     try {
          const beforeUpdate = await Document.findById(req.params.id);
          let updatedObject = {
               name: {
                    kz: req.body.kzName.trim(),
                    ru: req.body.ruName.trim(),
                    en: req.body.enName.trim()
               },
               pagePartId: req.body.pagePartId
          }

          if (req.file) {
               deleteFileFromFolder('documents', beforeUpdate.filename);
               updatedObject.filename = Buffer.from(req.file.originalname, 'latin1').toString('utf8');
          }

          const updatedDocument = await Document.findByIdAndUpdate(
               req.params.id,
               updatedObject
          );

          if (!updatedDocument) {
               res.status(404).json({
                    message: 'Document not found'
               });
          }
          
          res.json(updatedDocument);
     } catch (error) {
          console.log(error);
          res.status(500).json({
               message: error.message
          });
     }
}

export const deleteDocumentOfPagePart = async (req, res) => {
     try {
          const beforeDelete = await Document.findById(req.params.id);
          try {
               await Document.findByIdAndDelete(req.params.id);
          } catch (error) {
               console.log(error);
               res.status(500).json({
                    message: error.message
               });
          }
          

          const updatedCategory = await PagePart.findByIdAndUpdate(
               beforeDelete.pagePartId,
               {
                    $pull: {documents: beforeDelete._id}
               }
          );

          if (!updatedCategory) {
               res.status(400).json({
                    message: 'Category did not update'
               });
          }

          deleteFileFromFolder('documents', beforeDelete.filename);

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

export const showDocumentsByPagePart = async (req, res) => {
     try {
          const documents = await Document.find({pagePartId: req.params.id});
          if (!documents) {
               res.status(400).json({
                    message: 'Documents not found'
               });
          }
          res.json(documents);
     } catch (error) {
          console.log(error);
          res.status(500).json({
               message: error.message
          })
     }
}

