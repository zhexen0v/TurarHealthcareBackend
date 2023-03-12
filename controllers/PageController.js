import ParentPage from "../models/ParentPage.js";
import NestedPage from "../models/NestedPage.js";

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

export const addNewNestedPage = async (req, res) => {
     try {
          const newDocument = new NestedPage({
               parentPage: req.body.parentPage,
               title: req.body.title,
               content: req.body.content,
               link: req.body.link.trim()
          });
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