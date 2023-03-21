import Blog from "../models/Blog.js";
import City from '../models/City.js';
import { validationResult } from "express-validator";

export const addNewArticleIntoBlog = async (req, res) => {
     try {
          const errors = validationResult(req);
          if (!errors.isEmpty()){
               return res.status(400).json(errors.array());
          }
          const newDocument = new Blog({
               title: JSON.parse(req.body.json).title,
               content: JSON.parse(req.body.json).content,
               imageUrl: req.file.originalname,
               isRelatedToCity: req.body.isRelatedToCity
          });

          if (req.body.isRelatedToCity) {
               newDocument.city = req.body.city;
          }

          const newArticle = await newDocument.save();

          if (req.body.isRelatedToCity === 'true') {
               const updatedCity = await City.findByIdAndUpdate(
                    req.body.city,
                    {
                         $addToSet: {blog: newArticle._id}
                    }
               );  
               if (!updatedCity) {
                    res.status(404).json({
                         message: 'City not updated'
                    })
               }
          }
 
          
          res.json(newArticle);
          
     } catch (error) {
          console.log(error);
          res.status(500).json({
               message: error.message
          })
     }
}

export const updateArticleIntoBlog = async (req, res) => {
     try {
          const beforeUpdate = await Blog.findById(req.body.id);
          let updatedObj = {
               title: JSON.parse(req.body.json).title,
               content: JSON.parse(req.body.json).content,
               isRelatedToCity: req.body.isRelatedToCity,
          }
          if(req.body.isRelatedToCity !== 'false') {
               updatedObj.city = req.body.city;
          }
          if(req.file) {
               updatedObj.imageUrl = req.file.originalname;
          }
          const updatedArticle = await Blog.findByIdAndUpdate(
               req.body.id, 
               updatedObj
          );
          if (updatedArticle.matchedCount === 0) {
               return res.status(404).json({
                    message: 'Article not found'
               });
          }


          if (!beforeUpdate.city && req.body.isRelatedToCity === 'true') {
               await City.findByIdAndUpdate(
                    req.body.city,
                    {
                         $addToSet: {blog: req.body.id}
                    }
               );
          }

          if (beforeUpdate.city && req.body.isRelatedToCity === 'false') {
               await City.findByIdAndUpdate(
                    beforeUpdate.city,
                    {
                         $pull: {blog: req.body.id}
                    }
               );

               await Blog.findByIdAndUpdate(
                    req.body.id,
                    {
                         $unset: {city: 1}
                    }
               );
          }

          if (beforeUpdate.isRelatedToCity === 'true' && beforeUpdate.city !== req.body.city) {
               const updatePreviousCity = await City.findByIdAndUpdate(
                    beforeUpdate.city,
                    {
                         $pull: {blog: req.body.id}
                    }
               );
               if (!updatePreviousCity) {
                    return res.status(404).json({
                         message: 'Data of previous city did not update'
                    });
               }

               const updateNewCity = await City.findByIdAndUpdate(
                    req.body.city,
                    {
                         $addToSet: {blog: req.body.id}
                    }
               );
               if (!updateNewCity) {
                    return res.status(404).json({
                         message: 'Data of new city did not update'
                    });
               }
          }
          res.json(updatedArticle);
     } catch (error) {
          console.log(error);
          res.status(500).json({
               message: error.message
          });
     }
}

export const showAllArticles = async (req, res) => {
     try {
          const allArticles = await Blog.find().sort({createdAt: -1});
          if (allArticles.length === 0) {
               res.status(400).json({
                    message: 'Articles not found'
               });
          }
          res.json(allArticles);
     } catch (error) {
          console.log(error);
          res.status(500).json({
               message: error.message
          });
     }
}

export const showAllArticlesByCity = async (req, res) => {
     try {
          const allArticles = await Blog.find(
               {$and: [
                    {isRelatedToCity: true}, 
                    {city: req.body.city}
               ]}).sort({createdAt: -1});

          if (allArticles.length === 0) {
               res.status(400).json({
                    message: 'Articles not found'
               });
          }
          res.json(allArticles);
     } catch (error) {
          console.log(error);
          res.status(500).json({
               message: error.message
          });
     }
}

export const showLastArticles = async (req, res) => {
     try {
          const allArticles = await Blog.find().sort({createdAt: -1}).limit(3);
          if (allArticles.length === 0) {
               res.status(400).json({
                    message: 'Articles not found'
               });
          }
          res.json(allArticles);
     } catch (error) {
          console.log(error);
          res.status(500).json({
               message: error.message
          });
     }
}

export const showLastArticlesExceptSelected = async (req, res) => {
     try {
          const allArticles = await Blog.find({_id: {$ne: req.params.id}}).sort({createdAt: -1}).limit(3);
          if (allArticles.length === 0) {
               res.status(400).json({
                    message: 'Articles not found'
               });
          }
          res.json(allArticles);
     } catch (error) {
          console.log(error);
          res.status(500).json({
               message: error.message
          });
     }
}

export const showArticleById = async (req, res) => {
     try {
          const article = await Blog.findById(req.params.id);
          if (!article) {
               res.status(400).json({
                    message: 'Article not found'
               });
          }
          res.json(article);
     } catch (error) {
          console.log(error);
          res.status(500).json({
               message: error.message
          });
     }
}

export const deleteArticle = async (req, res) => {
     try {
          const deletedArticle = await Blog.findByIdAndDelete(req.params.id);
          if(deletedArticle.deletedCount !== 1) {
               res.status(400).json({
                    message: 'Article not deleted'
               });
          }
     } catch (error) {
          console.log(error);
          res.status(500).json({
               message: error.message
          });  
     }
}