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

export const getUserUrls = async (req: Request, res: Response) => {
  try {
    const urls = await db.query(
      "SELECT * FROM urls WHERE owner = $1 and exclude_date IS NULL",
      [req.user.userId]
    );

    res.status(200).json(urls.rows);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const updateUrl = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    const { url } = req.body;

    if (!url) return res.status(400).json({ message: "URL is required" });
    if (!id) return res.status(400).json({ message: "URL ID is required" });

    const urlResult = await db.query("SELECT * FROM urls WHERE id = $1", [id]);
    if (urlResult.rowCount === 0) {
      return res.status(404).json({ message: "URL not found" });
    }

    if (urlResult.rows[0].owner !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await db.query(
      "UPDATE urls SET url_target = $1, last_update = $2 WHERE id = $3",
      [url, new Date(), id]
    );

    res.status(200).json({ message: "URL updated successfully" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteUrl = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "URL ID is required" });

    const url = await db.query("SELECT * FROM urls WHERE id = $1", [id]);
    if (url.rowCount === 0) {
      return res.status(404).json({ message: "URL not found" });
    }

    if (url.rows[0].owner !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (url.rows[0].exclude_date) {
      return res.status(400).json({ message: "URL already deleted" });
    }

    // UPDATE exclude_date to the current date
    await db.query("UPDATE urls SET exclude_date = $1 WHERE id = $2", [
      new Date(),
      id,
    ]);

    res.status(200).json({ message: "URL deleted successfully" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
