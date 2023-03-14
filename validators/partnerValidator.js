import { body } from "express-validator";

export const addOrUpdatePartner = [
     body("kz")
          .exists({ checkFalsy: true })
          .withMessage("Title in Kazakh is required")
          .isString()
          .withMessage("Title in Kazakh should be string"),
     body("ru")
          .exists({ checkFalsy: true })
          .withMessage("Title in Russian is required")
          .isString()
          .withMessage("Title in Russian should be string"),
     body("en")
          .exists({ checkFalsy: true })
          .withMessage("Title in English is required")
          .isString()
          .withMessage("Title in English should be string")
];