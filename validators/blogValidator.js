import { body } from 'express-validator';    

export const blogUpdateValidator = [
     body("kz")
          .exists({ checkFalsy: true })
          .withMessage("Request in Kazakh is required")
          .isObject()
          .withMessage("Request in Kazakh should be object"),
     body("kz.title")
          .exists({ checkFalsy: true })
          .withMessage("Title in Kazakh is required")
          .isString()
          .withMessage("Title in Kazakh should be string"),
     body("kz.content")
          .exists({ checkFalsy: true })
          .withMessage("Content in Kazakh is required")
          .isString()
          .withMessage("Content in Kazakh should be string"),

     body("ru")
          .exists({ checkFalsy: true })
          .withMessage("Request in Russian is required")
          .isObject()
          .withMessage("Request in Russian should be object"),
     body("ru.title")
          .exists({ checkFalsy: true })
          .withMessage("Title in Russian is required")
          .isString()
          .withMessage("Title in Russian should be string"),
     body("ru.content")
          .exists({ checkFalsy: true })
          .withMessage("Content in Russian is required")
          .isString()
          .withMessage("Content in Russian should be string")
     
];