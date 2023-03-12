import { body } from 'express-validator';

export const updateGeneralInformtaionValidator = [
     body("phoneNumber")
          .exists({ checkFalsy: true })
          .withMessage("Обязательное поле")
          .isString()
          .withMessage("Phone should be string"),

     body("address")
          .exists({ checkFalsy: true })
          .withMessage("Обязательное поле")
          .isObject()
          .withMessage("Address should be object"),
     body("address.kz")
          .exists({ checkFalsy: true })
          .withMessage("Обязательное поле")
          .isString()
          .withMessage("Address(kz) should be string"),
     body("address.ru")
          .exists({ checkFalsy: true })
          .withMessage("Обязательное поле")
          .isString()
          .withMessage("Address(ru) should be string"),
     body("address.en")
          .exists({ checkFalsy: true })
          .withMessage("Обязательное поле")
          .isString()
          .withMessage("Address(en) should be string"),
     

     body("mail")
          .exists({ checkFalsy: true })
          .withMessage("Обязательное поле")
          .isEmail()
          .withMessage("Mail should be email"),

     body("firstTitle")
          .exists({ checkFalsy: true })
          .withMessage("Обязательное поле")
          .isString()
          .withMessage("First title should be string"),

     body("secondTitle")
          .exists({ checkFalsy: true })
          .withMessage("Обязательное поле")
          .isObject()
          .withMessage("Second title should be object"),
     body("secondTitle.kz")
          .exists({ checkFalsy: true })
          .withMessage("Обязательное поле")
          .isString()
          .withMessage("Second title(kz) should be string"),
     body("secondTitle.ru")
          .exists({ checkFalsy: true })
          .withMessage("Обязательное поле")
          .isString()
          .withMessage("Second title(ru) should be string"),
     body("secondTitle.en")
          .exists({ checkFalsy: true })
          .withMessage("Обязательное поле")
          .isString()
          .withMessage("Second title(en) should be string"),

     body("additionalTitle")
          .exists({ checkFalsy: true })
          .withMessage("Обязательное поле")
          .isObject()
          .withMessage("Additional title should be object"),
     body("additionalTitle.kz")
          .exists({ checkFalsy: true })
          .withMessage("Обязательное поле")
          .isString()
          .withMessage("Additional title(kz) should be string"),
     body("additionalTitle.ru")
          .exists({ checkFalsy: true })
          .withMessage("Обязательное поле")
          .isString()
          .withMessage("Additional title(ru) should be string"),
     body("additionalTitle.en")
          .exists({ checkFalsy: true })
          .withMessage("Обязательное поле")
          .isString()
          .withMessage("Additional title(ru) should be string"),
     
     body("instagramLink")
          .exists({ checkFalsy: true })
          .withMessage("Обязательное поле")
          .isURL()
          .withMessage("Это поле должно быть ссылкой"),
];