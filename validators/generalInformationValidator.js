import { body } from 'express-validator';

export const updateGeneralInformtaionValidator = [
     body("phone")
          .exists({ checkFalsy: true })
          .withMessage("Phone is required")
          .isString()
          .withMessage("Phone should be string"),

     body("address")
          .exists({ checkFalsy: true })
          .withMessage("Address is required")
          .isObject()
          .withMessage("Address should be object"),
     body("address.kz")
          .exists({ checkFalsy: true })
          .withMessage("Address(kz) is required")
          .isString()
          .withMessage("Address(kz) should be string"),
     body("address.ru")
          .exists({ checkFalsy: true })
          .withMessage("Address(ru) is required")
          .isString()
          .withMessage("Address(ru) should be string"),

     body("mail")
          .exists({ checkFalsy: true })
          .withMessage("Mail is required")
          .isEmail()
          .withMessage("Mail should be email"),

     body("firstTitle")
          .exists({ checkFalsy: true })
          .withMessage("First title is required")
          .isString()
          .withMessage("First title should be string"),

     body("secondTitle")
          .exists({ checkFalsy: true })
          .withMessage("Second title is required")
          .isObject()
          .withMessage("Second title should be object"),
     body("secondTitle.kz")
          .exists({ checkFalsy: true })
          .withMessage("Second title(kz) is required")
          .isString()
          .withMessage("Second title(kz) should be string"),
     body("secondTitle.ru")
          .exists({ checkFalsy: true })
          .withMessage("Second title(ru) is required")
          .isString()
          .withMessage("Second title(ru) should be string"),

     body("additionalTitle")
          .exists({ checkFalsy: true })
          .withMessage("Additional title is required")
          .isObject()
          .withMessage("Additional title should be object"),
     body("additionalTitle.kz")
          .exists({ checkFalsy: true })
          .withMessage("Additional title(kz) is required")
          .isString()
          .withMessage("Additional title(kz) should be string"),
     body("additionalTitle.ru")
          .exists({ checkFalsy: true })
          .withMessage("Additional title(ru) is required")
          .isString()
          .withMessage("Additional title(ru) should be string"),
];