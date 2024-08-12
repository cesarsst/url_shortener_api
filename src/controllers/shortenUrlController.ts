import { Request, Response } from "express";
import { verifyIfUrlIsValid } from "../utils/url";
import { generateShortHash } from "../utils/shortenUrl";
import jwt from "jsonwebtoken";
import type { UserTokenDecoded } from "../types";
import UserModel from "../models/userModel";
import UrlModel from "../models/urlModel";

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

      user = await UserModel.getUserById(userId);
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
      const result = await UrlModel.getUrlById(hash);
      if (result.rows.length === 0) {
        break;
      } else {
        hash = null;
      }
    }

    const shortUrl = `${process.env.BASE_URL}/${hash}`;

    // Save the URL in the database
    if (req.user) {
      await UrlModel.createUrl(url, hash, req.user.userId);
    } else {
      await UrlModel.createUrl(url, hash, null);
    }

    res.status(201).json({ shortUrl });
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

export const getShortenUrl = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "URL id is required" });

    const result = await UrlModel.getUrlById(id);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "URL not found" });
    }

    // Update access counter
    await UrlModel.incrementAccessCounter(id);

    const { url_target } = result.rows[0];
    res.status(302).redirect(url_target);
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
