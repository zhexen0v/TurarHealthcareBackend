import Blog from "../models/Blog.js";
import { validationResult } from "express-validator";

export const addNewArticleIntoBlog = async (req, res) => {
     try {
          const errors = validationResult(req);
          if (!errors.isEmpty()){
               return res.status(400).json(errors.array());
          }
          const newDocument = new Blog({
               kz: JSON.parse(req.body.json).kz,
               ru: JSON.parse(req.body.json).ru,
               en: JSON.parse(req.body.json).en,
               imageUrl: req.file.originalname
          });

          const newArticle = await newDocument.save();
          
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
          let updatedObj = {
               kz: JSON.parse(req.body.json).kz,
               ru: JSON.parse(req.body.json).ru,
               en: JSON.parse(req.body.json).en,
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