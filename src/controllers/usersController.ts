import { Request, Response } from "express";
import userModel from "../models/userModel";
import urlModel from "../models/urlModel";

export const me = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await userModel.getUserById(req.user.userId);

    res.status(200).json(user.rows[0]);
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

export const getUserUrls = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const urls = await userModel.getUserUrls(req.user.userId);
    res.status(200).json(urls.rows);
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

export const updateUrl = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { userId } = req.user;
    const { id } = req.params;
    const { url } = req.body;

    if (!url) return res.status(400).json({ message: "URL is required" });
    if (!id) return res.status(400).json({ message: "URL ID is required" });

    const urlResult = await urlModel.getUrlActiveById(id);
    if (urlResult.rowCount === 0) {
      return res.status(404).json({ message: "URL not found" });
    }

    if (urlResult.rows[0].owner !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await urlModel.updateUrl(id, url);

    res.status(200).json({ message: "URL updated successfully" });
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

export const deleteUrl = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { userId } = req.user;
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "URL ID is required" });

    const url = await urlModel.getUrlById(id);
    if (url.rowCount === 0) {
      return res.status(404).json({ message: "URL not found" });
    }

    if (url.rows[0].owner !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (url.rows[0].exclude_date) {
      return res.status(400).json({ message: "URL already deleted" });
    }

    await urlModel.deleteUrl(id);

    res.status(200).json({ message: "URL deleted successfully" });
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
