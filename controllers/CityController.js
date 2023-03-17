import City from "../models/City.js";
import Blog from "../models/Blog.js";
import { validationResult } from "express-validator";

export const addNewCity = async (req, res) => {
     try {
          const errors = validationResult(req);
          if (!errors.isEmpty()){
               return res.status(400).json(errors.array());
          }
          const newDocument = new City({
               name: req.body.name,
               content: req.body.content,
               link: req.body.name.en.trim().toLowerCase(),
               coordinates: {
                    horizontal: req.body.horizontal,
                    vertical: req.body.vertical
               }
          });
          const newCity = await newDocument.save();
          res.json(newCity);
     } catch (error) {
          console.log(error);
          res.status(500).json({
               message: error.message
          });
     }
}

export const getAllCities = async (req, res) => {
     try {
          const cities = await City.find().sort({'name.ru': -1});
          res.json(cities);
     } catch (error) {
          console.log(error);
          res.status(500).json({
               message: error.message
          })
     }
}

export const getCityByLink = async (req, res) => {
     try {
          const city = await City.findOne({link: req.params.link}).populate('blog').exec();
          if (!city) {
               res.status(404).json({
                    message: 'City not found'
               });
          }
          res.json(city);
     } catch (error) {
          console.log(error);
          res.status(500).json({
               message: error.message
          })
     }
}

export const updateCity = async (req, res) => {
     try {
          const errors = validationResult(req);
          if (!errors.isEmpty()){
               return res.status(400).json(errors.array());
          }
          const updatedCity = await City.findByIdAndUpdate(
               req.params.id,
               {
                    name: req.body.name,
                    content: req.body.content,
                    link: req.body.name.en.trim().toLowerCase(),
                    coordinates: {
                         horizontal: req.body.horizontal,
                         vertical: req.body.vertical
                    }
               }
          )
          
          if(!updatedCity) {
               res.status(400).json({
                    message: 'City not updated'
               });
          }
          res.json(updatedCity);
     } catch (error) {
          console.log(error);
          res.status(500).json({
               message: error.message
          });
     }
}

export const deleteCity = async (req, res) => {
     try {
          const deletedCity = await City.findByIdAndDelete(req.params.id);
          if (!deletedCity) {
               res.status(400).json({
                    message: 'City not deleted'
               });
          }

          const deleteArticlesByCity = await Blog.deleteMany({$and: [{isRelatedToCity: true}, {city: req.params.id}]});
          if(!deleteArticlesByCity) {
               res.status(400).json({
                    message: 'City not updated'
               });
          }
          res.json({
               message: 'City successfully deleted'
          });
     } catch (error) {
          console.log(error);
          res.status(500).json({
               message: error.message
          });
     }
}

