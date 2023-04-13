import ParentPage from "../models/ParentPage.js";
import NestedPage from "../models/NestedPage.js";
import Document from "../models/Document.js";
import PagePart from "../models/PagePart.js";

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
          const parentPages = await ParentPage.find()
          .populate({
               path: 'nestedPages',
               select: '_id title link',
               options: { sort: {orderNumber: 1}},
               populate: {
                    path: 'parts'
               }
          })
          .exec();
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
          const dataOfPage = await NestedPage.findOne({link: req.params.link}).populate('documents').exec();
          // const data = await ParentPage.find({isNested: true}).populate('nestedPages').exec();
          // let dataOfPage = {};
          // const arrayOfPages = [];
          // data.forEach(page => {
          //      arrayOfPages.push(...page.nestedPages);
          // });
          // arrayOfPages.forEach(p => {
          //      if (p.link === req.params.link) {
          //           dataOfPage = p;
          //      }
          // });
          const parentPage = await ParentPage
          .findById(dataOfPage.parentPage)
          .populate({
               path: 'nestedPages',
               select: '_id title link parts',
               options: { sort: {orderNumber: 1}},
               populate: 'parts'
          })
          .exec();
          res.json({
               data: dataOfPage,
               parent: parentPage
          });
     } catch (error) {
          console.log(error);
          res.status(404).json({
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
          const pages = await NestedPage.find({parentPage: req.body.parentPage});
          const newDocument = new NestedPage({
               parentPage: req.body.parentPage,
               title: req.body.title,
               isListOfDocuments: req.body.isListOfDocuments,
               link: req.body.link.trim(),
               orderNumber: pages.length + 1
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

          if (!beforeUpdate.isListOfDocuments) {
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
          console.log(req.params.id);
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

export const incrementOrderOfPage = async (req, res) => {
     try {
          await NestedPage.findByIdAndUpdate(
               req.params.id,
               {
                    $inc: {orderNumber: -1} 
               }
          )
          const page = await NestedPage.findById(req.params.id);
          const v = await NestedPage.updateOne({$and: [
               {_id: {$ne: page._id}},
               {parentPage: page.parentPage},
               {orderNumber: page.orderNumber}
          ]}, {
               $inc: {orderNumber: 1}
          });
          res.json(page);
     } catch (error) {
          console.log(error);
          res.status(500).json({
               message: error.message
          });
     }
}

export const decrementOrderOfPage = async (req, res) => {
     try {
          await NestedPage.findByIdAndUpdate(
               req.params.id,
               {
                    $inc: {orderNumber: 1} 
               }
          )
          const page = await NestedPage.findById(req.params.id);
          await NestedPage.updateOne({$and: [
               {_id: {$ne: page._id}},
               {orderNumber: page.orderNumber}
          ]}, {
               $inc: {orderNumber: -1}
          })
          res.json(page);
     } catch (error) {
          console.log(error);
          res.status(500).json({
               message: error.message
          });
     }
}

export const addPartOfNestedPage = async (req, res) => {
     try {
          const newDocument = new PagePart({
               pageId: req.body.pageId,
               title: req.body.title,
               isListOfDocuments: req.body.isListOfDocuments,
               link: req.body.link.trim()
          });
          if (req.body.isListOfDocuments) {
               newDocument.documents = req.body.documents;
          } else {
               newDocument.content = req.body.content;
          }
          const newPagePart = await newDocument.save();
          await NestedPage.updateOne({
               _id: req.body.pageId
          }, {
               $addToSet: {parts: newPagePart._id}
          });
          res.json(newPagePart);
     } catch (err) {
          console.log(err);
          res.status(500).json({
               message: err.message
          });
     }
}

export const updatePagePart = async (req, res) => {
     try {
          const beforeUpdate =  await NestedPage.findById(req.body.id);
          const updatedObj = {
               title: req.body.title,
               link: req.body.link
          }
          if (!beforeUpdate.isListOfDocuments) {
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

export const deletePagePart = async (req, res) => {
     try {
          const beforeDelete = await PagePart.findById(req.params.id);
          await PagePart.findByIdAndDelete(req.params.id);

          if (beforeDelete.isListOfDocuments) {
               await Document.deleteMany({pageId: req.params.id})
          }
          
          await NestedPage.findByIdAndUpdate(
               beforeDelete.pageId,
               {
                    $pull: {parts: req.params.id}
               }
          )

          res.json({
               message: 'Page part successfully deleted'
          })

     } catch (error) {
          console.log(error);
          res.status(500).json({
               message: error.message
          })
     }
}
export const showPagePartByLink = async (req, res) => {
     try {
          const data = await PagePart.findOne({link: req.params.link}).populate('documents').exec();
          const parentPage = await ParentPage
          .findOne({nestedPages: {$in: data.pageId}})
          .populate({
               path: 'nestedPages',
               select: '_id title link parts',
               options: { sort: {orderNumber: 1}},
               populate: 'parts'
          })
          .exec();
          if (!data) {
               res.status(400).json({
                    message: 'Error during fetch data'
               });
          }
          res.json({
               data: data,
               parent: parentPage
          });
     } catch (error) {
          console.log(error);
          res.status(500).json({
               message: error.message
          });
     }
}

export const showPagePartById = async (req, res) => {
     try {
          const data = await PagePart.findById(req.params.id);
          res.json(data);
     } catch (error) {
          console.log(error);
          res.status(500).json({
               message: error.message
          });
     }
}