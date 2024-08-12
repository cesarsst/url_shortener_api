import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/userModel";

const SECRET_KEY = process.env.SECRET_KEY || "secret";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (process.env.SECRET_KEY === undefined) {
      throw new Error("Secret key is not defined");
    }

    if (!name || !email || !password) {
      res.status(400).json({
        message: "All fields are necessary (name, email and password)!",
      });
      return;
    }

    const user = await verifyIfUserExists(email);
    if (user) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.createUser(name, email, hashedPassword);

    const token = jwt.sign(
      { userId: newUser.rows[0].id, email },
      process.env.SECRET_KEY,
      {
        expiresIn: "2h",
      }
    );
    res.status(201).json({ token });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    } else {
      console.error("An unexpected error occurred");
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await verifyIfUserExists(email);
    if (!user) {
      res.status(400).json({ message: "User does not exist" });
      return;
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(400).json({ message: "Invalid password" });
      return;
    }

    const token = jwt.sign({ userId: user.id, email }, SECRET_KEY, {
      expiresIn: "2h",
    });
    res.status(200).json({ token });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    } else {
      console.error("An unexpected error occurred");
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};

const verifyIfUserExists = async (email: string) => {
  const user = await UserModel.getUserByEmail(email);
  return user.rows[0];
};
