import { body } from 'express-validator';

export const adminRegisterValidator = [
     body("name")
          .exists({ checkFalsy: true })
          .withMessage("Name is required")
          .isString()
          .withMessage("Name should be string"),
     body("surname")
          .exists({ checkFalsy: true })
          .withMessage("Surname is required")
          .isString()
          .withMessage("Surname should be string"),
     body("username")
          .exists({ checkFalsy: true })
          .withMessage("Username is required")
          .isString()
          .withMessage("Username should be string"),
     body("password")
          .exists()
          .withMessage("Password is required")
          .isString()
          .withMessage("Password should be string")
          .isLength({ min: 8 })
          .withMessage("Password should be at least 8 characters"),
];

export const adminLoginValidator = [
     body("username")
          .exists({ checkFalsy: true })
          .withMessage("Username is required")
          .isString()
          .withMessage("Username should be string"),
     body("password")
          .exists()
          .withMessage("Password is required")
          .isString()
          .withMessage("Password should be string")
          .isLength({ min: 8 })
          .withMessage("Password should be at least 8 characters"),
];