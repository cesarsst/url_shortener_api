import { Request, Response } from "express";
import { db } from "../db";

export const me = async (req: Request, res: Response) => {
  try {
    const user = await db.query("SELECT id, email FROM users WHERE id = $1", [
      req.user.userId,
    ]);

    res.status(200).json(user.rows[0]);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
