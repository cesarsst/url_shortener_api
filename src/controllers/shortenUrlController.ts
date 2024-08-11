import { Request, Response } from "express";
import { verifyIfUrlIsValid } from "../utils/url";
import { generateShortHash } from "../utils/shortenUrl";
import { db } from "../db";
import jwt from "jsonwebtoken";
import type { UserTokenDecoded } from "../types";

export const shortenUrl = async (req: Request, res: Response) => {
  try {
    const { url } = req.body;

    if (!url) return res.status(400).json({ message: "URL is required" });
    if (!verifyIfUrlIsValid(url))
      return res.status(400).json({ message: "Invalid URL" });

    // Verify if the user is authenticated
    let token = null;
    let user = null;
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.SECRET_KEY || "secret");
      const { userId, email } = decoded as UserTokenDecoded;

      user = await db.query(
        "SELECT * FROM users WHERE id = $1 AND email = $2",
        [userId, email]
      );
      if (user.rows.length === 0) {
        return res.status(401).json({ message: "User not found" });
      } else {
        req.user = { userId, email };
      }
    }

    // Generate a short hash
    let hash = null;
    while (hash === null) {
      hash = generateShortHash();
      const result = await db.query("SELECT * FROM urls WHERE id = $1", [hash]);
      if (result.rows.length === 0) {
        break;
      } else {
        hash = null;
      }
    }

    const shortUrl = `${process.env.BASE_URL}/${hash}`;

    // Save the URL in the database
    if (req.user) {
      await db.query(
        "INSERT INTO urls (id, owner, url_target, access_counter, last_update) VALUES ($1, $2, $3, $4, $5)",
        [hash, req.user.userId, url, 0, new Date()]
      );
    } else {
      await db.query(
        "INSERT INTO urls (id, url_target, access_counter, last_update) VALUES ($1, $2, $3, $4)",
        [hash, url, 0, new Date()]
      );
    }

    res.status(201).json({ shortUrl });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getShortenUrl = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "URL id is required" });

    const result = await db.query("SELECT * FROM urls WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "URL not found" });
    }

    // Update access counter
    await db.query(
      "UPDATE urls SET access_counter = access_counter + 1 WHERE id = $1",
      [id]
    );

    const { url_target } = result.rows[0];
    res.status(302).redirect(url_target);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
