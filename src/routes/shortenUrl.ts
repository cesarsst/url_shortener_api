import express from "express";
import { getShortenUrl, shortenUrl } from "../controllers/shortenUrlController";
import { shortenUrlValidator } from "../validators/shortenUrlValidator";
import path from "path";

const router = express.Router();

router.route("/").get((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
router.route("/:id").get(getShortenUrl);
router.route("/generateShortLink").post(shortenUrlValidator, shortenUrl);

export default router;

/**
 * @swagger
 * tags:
 *   name: URL Shortener
 *   description: API for shortening URLs
 */

/**
 * @swagger
 * /generateShortLink:
 *   post:
 *     summary: Shorten a given URL
 *     tags: [URL Shortener]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 description: The URL to be shortened. Must be a valid URL.
 *                 example: "https://www.example.com"
 *             required:
 *               - url
 *     responses:
 *       201:
 *         description: URL successfully shortened
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shortUrl:
 *                   type: string
 *                   description: The shortened URL
 *                   example: "http://localhost/abc123"
 *       400:
 *         description: |
 *           Invalid or missing URL. The URL provided is not valid or is missing from the request.
 *           - URL must be a valid URL format.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid URL"
 *       401:
 *         description: User is not authenticated or user not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while shortening the URL"
 */

/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Redirect to the original URL using the shortened URL ID
 *     tags: [URL Shortener]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 6
 *         description: The ID of the shortened URL. Must be a string with 6 characters.
 *     responses:
 *       302:
 *         description: Redirects to the original URL
 *       400:
 *         description: |
 *           Invalid or missing URL ID. The ID provided is not valid or is missing.
 *           - ID must be a string with 6 characters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "URL ID is required and must be 6 characters long"
 *       404:
 *         description: URL not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "URL not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 */
