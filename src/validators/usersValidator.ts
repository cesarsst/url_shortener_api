import { body, validationResult } from "express-validator";
import type { Request, Response, NextFunction } from "express";

export const updateUrlValidator = [
  body("url").isURL().withMessage("Invalid URL"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    next();
  },
];
