import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { db } from "../db";
import type { UserTokenDecoded } from "../types";

// Middleware to check if the user is authenticated
const authMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!process.env.SECRET_KEY) {
        throw new Error("Secret key is not defined");
      }

      // Check if the user is authenticated
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        // Check if the token is valid
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        const { userId, email } = decoded as UserTokenDecoded;
        const user = await db.query(
          "SELECT * FROM users WHERE id = $1 AND email = $2",
          [userId, email]
        );

        if (user.rows.length === 0) {
          throw new Error("Unauthorized");
        }

        req.user = { userId, email };

        next();
      } else {
        throw new Error("Unauthorized");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        res.status(401).json({ message: "Unauthorized" });
      } else {
        console.error("An unexpected error occurred");
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  }
);

export default authMiddleware;
