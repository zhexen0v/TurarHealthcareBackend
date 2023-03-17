import { body } from 'express-validator';    

export const blogUpdateValidator = [
     body("title")
          .exists({ checkFalsy: true })
          .withMessage("Title is required")
          .isObject()
          .withMessage("Title should be object"),
     body("title.kz")
          .exists({ checkFalsy: true })
          .withMessage("Title in Kazakh is required")
          .isString()
          .withMessage("Title in Kazakh should be string"),
     body("title.ru")
          .exists({ checkFalsy: true })
          .withMessage("Title in Russian is required")
          .isString()
          .withMessage("Title in Russian should be string"),
     body("title.en")
          .exists({ checkFalsy: true })
          .withMessage("Title in English is required")
          .isString()
          .withMessage("Title in English should be string"),

     body("content")
          .exists({ checkFalsy: true })
          .withMessage("Content is required")
          .isObject()
          .withMessage("Content should be object"),
     body("content.kz")
          .exists({ checkFalsy: true })
          .withMessage("Content in Kazakh is required")
          .isString()
          .withMessage("Content in Kazakh should be string"),
     body("content.ru")
          .exists({ checkFalsy: true })
          .withMessage("Content in Russian is required")
          .isString()
          .withMessage("Content in Russian should be string"),
     body("content.en")
          .exists({ checkFalsy: true })
          .withMessage("Content in English is required")
          .isString()
          .withMessage("Content in English should be string"),
];