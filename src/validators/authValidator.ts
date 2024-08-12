import { body, validationResult } from "express-validator";
import type { Request, Response, NextFunction } from "express";

export const validateRegister = [
  body("name").isString().notEmpty(),
  body("email").isEmail(),
  body("password").isString().isLength({ min: 6 }),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    next();
  },
];

export const validateLogin = [
  body("email").isEmail(),
  body("password").isString().isLength({ min: 6 }),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    next();
  },
];
