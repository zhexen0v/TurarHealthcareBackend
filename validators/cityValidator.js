import { body } from "express-validator";

export const addOrUpdateCityValidator = [
     body("name")
          .exists({ checkFalsy: true })
          .withMessage("Обязательное поле")
          .isObject()
          .withMessage("Name should be object"),
     
     body("name.kz")
          .exists({ checkFalsy: true })
          .withMessage("Обязательное поле")
          .isString()
          .withMessage("Name(kz) should be string"),

     body("name.ru")
          .exists({ checkFalsy: true })
          .withMessage("Обязательное поле")
          .isString()
          .withMessage("Name(ru) should be string"),

     body("name.en")
          .exists({ checkFalsy: true })
          .withMessage("Обязательное поле")
          .isString()
          .withMessage("Name(en) should be string"),
     
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
     
     body("horizontal")
          .exists({ checkFalsy: true })
          .withMessage("Horizontal is required")
          .isNumeric()
          .withMessage("Horizontal should be number"),
     body("vertical")
          .exists({ checkFalsy: true })
          .withMessage("Vertical is required")
          .isNumeric()
          .withMessage("Vertical should be number"),
];