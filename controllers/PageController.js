import ParentPage from "../models/ParentPage.js";
import NestedPage from "../models/NestedPage.js";
import Document from "../models/Document.js";

export const addNewParentPage = async (req, res) => {
     try {
          const newDocument = new ParentPage({
               title: req.body.title,
               link: req.body.link.trim(),
               isNested: req.body.isNested
          });
          const newParentPage = await newDocument.save();
          res.json(newParentPage);
     } catch (error) {
          console.log(error);
          res.status(500).json({
               message: error.message
          });
     }
}

export const showAllParentPage = async (req, res) => {
     try {
          const parentPages = await ParentPage.find().populate('nestedPages', '_id title link').exec();
          if (parentPages.length === 0) {
               res.status(400).json({
                    message: 'Pages not found'
               });
          }
          res.json(parentPages);
     } catch (error) {
          console.log(error);
          res.status(500).json({
               message: error.message
          })
     }
}

export const showAllPages = async(req, res) => {
     try {
          const pages = await ParentPage.find({isNested: true}).populate('nestedPages').exec();
          const arrayOfPages = [];
          pages.forEach(page => {
               arrayOfPages.push(...page.nestedPages);
          });
          res.json(arrayOfPages);
     } catch (error) {
          console.log(error);
          res.status(500).json({
               message: error.message
          })
     }
}

export const showPageByLink = async (req, res) => {
     try {
          const data = await ParentPage.find({isNested: true}).populate('nestedPages').exec();
          let dataOfPage = {};
          const arrayOfPages = [];
          data.forEach(page => {
               arrayOfPages.push(...page.nestedPages);
          });
          arrayOfPages.forEach(p => {
               if (p.link === req.params.link) {
                    dataOfPage = p;
               }
          });
          const parentPage = await ParentPage.findById(dataOfPage.parentPage).populate('nestedPages').exec();
          res.json({
               data: dataOfPage,
               parent: parentPage
          });
     } catch (error) {
          console.log(error);
          res.status(500).json({
               message: error.message
          });
     }
}

export const showNestedPageById = async (req, res) => {
     try {
          const data = await NestedPage.findById(req.params.id);
          if (!data) {
               res.status(400).json({
                    message: 'Error during fetch data'
               });
          }
          res.json(data);
     } catch (error) {
          console.log(error);
          res.status(500).json({
               message: error.message
          });
     }
}

export const addNewNestedPage = async (req, res) => {
     try {
          const newDocument = new NestedPage({
               parentPage: req.body.parentPage,
               title: req.body.title,
               isListOfDocuments: req.body.isListOfDocuments,
               link: req.body.link.trim()
          });
          if (req.body.isListOfDocuments) {
               newDocument.documents = req.body.documents;
          } else {
               newDocument.content = req.body.content;
          }
          const newNestedPage = await newDocument.save();
          const updatedParentPage = await ParentPage.updateOne({
               _id: req.body.parentPage
          }, {
               $addToSet: {nestedPages: newNestedPage._id}
          });
          if(updatedParentPage.modifiedCount === 0) {
               res.status(400).json({
                    message: 'Parent page not found'
               });  
          }
          res.json({
               nestedPage: newNestedPage,
               parentPage: updatedParentPage
          });
     } catch (error) {
          console.log(error);
          res.status(500).json({
               message: error.message
          });
     }
}

export const updateNestedPage = async (req, res) => {
     try {
          const beforeUpdate =  await NestedPage.findById(req.body.id);
          const updatedObj = {
               title: req.body.title,
               link: req.body.link
          }

          if (beforeUpdate.isListOfDocuments) {
               updatedObj.documents = req.body.documents;
          } else {
               updatedObj.content = req.body.content;
          }

          const updatedPage = await NestedPage.findByIdAndUpdate(
               req.body.id,
               updatedObj
          );
          if (updatedPage.modifiedCount === 0) {
               res.status(400).json({
                    message: 'Page not updated'
               });
          }
          res.json(updatedPage);
     } catch (error) {
          console.log(error);
          res.status(500).json({
               message: error.message
          })
     }
}

export const deleteNestedPage = async (req, res) => {
     try {
          const beforeDelete = await NestedPage.findById(req.params.id);
          console.log(beforeDelete);
          try {
               await NestedPage.findByIdAndDelete(req.params.id);
          } catch (error) {
               res.status(500).json({
                    message: error.message
               });
          }

          if (beforeDelete.isListOfDocuments) {
               try {
                    await Document.deleteMany({pageId: req.params.id})
               } catch (error) {
                    res.status(500).json({
                         message: error.message
                    }); 
               }
          }

          res.json({
               message: 'Nested Page successfully deleted'
          })

     } catch (error) {
          console.log(error);
          res.status(500).json({
               message: error.message
          })
     }
}