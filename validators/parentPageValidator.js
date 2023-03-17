import { body } from "express-validator";

export const addParentPageValidator = [
     body("title")
          .exists({ checkFalsy: true })
          .withMessage("Обязательное поле")
          .isObject()
          .withMessage("Title should be object"),
     
     body("title.kz")
          .exists({ checkFalsy: true })
          .withMessage("Обязательное поле")
          .isString()
          .withMessage("Title(kz) should be string"),

     body("title.ru")
          .exists({ checkFalsy: true })
          .withMessage("Обязательное поле")
          .isString()
          .withMessage("Title(ru) should be string"),

     body("title.en")
          .exists({ checkFalsy: true })
          .withMessage("Обязательное поле")
          .isString()
          .withMessage("Title(en) should be string"),

     body("link")
          .exists({ checkFalsy: true })
          .withMessage("Обязательное поле")
          .isString()
          .withMessage("Content(en) should be string"),
];