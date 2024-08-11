import express from "express";
import { getShortenUrl, shortenUrl } from "../controllers/shortenUrlController";

const router = express.Router();

router.route("/:id").get(getShortenUrl);
router.route("/generateShortLink").post(shortenUrl);

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
 *                 example: "https://www.example.com"
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
 *         description: Invalid or missing URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "URL is required"
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
 *     summary: Redirect to the original URL using the shortened URL id
 *     tags: [URL Shortener]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the shortened URL
 *     responses:
 *       302:
 *         description: Redirects to the original URL
 *       400:
 *         description: URL ID is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "URL id is required"
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
 *                   type: string
 *                   example: "An error occurred while retrieving the URL"
 */
