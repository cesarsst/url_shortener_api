import express from "express";
import { login, register } from "../controllers/authController";
import { validateRegister, validateLogin } from "../validators/authValidator";

const router = express.Router();

router.route("/login").post(validateLogin, login);
router.route("/register").post(validateRegister, register);

export default router;

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Routes related to authentication
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Logs in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the user. Must be a valid email format.
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 description: The password for the user account. Must be a string with at least 6 characters.
 *                 example: "password123"
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Successful login, returns a JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *       400:
 *         description: |
 *           Validation errors or invalid credentials:
 *           - Email must be a valid email address.
 *           - Password must be a string with at least 6 characters.
 *           - Possible error messages:
 *             - "User does not exist"
 *             - "Invalid password"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid password"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error logging in"
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registers a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the user
 *                 example: "John Doe"
 *                 minLength: 3
 *               email:
 *                 type: string
 *                 description: The email address of the user
 *                 example: "user@example.com"
 *                 format: email
 *               password:
 *                 type: string
 *                 description: The password for the user account
 *                 example: "password123"
 *                 minLength: 6
 *             required:
 *               - name
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User successfully registered, returns a JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *       400:
 *         description: |
 *           Validation errors or the user already exists.
 *           - Name must be a string with at least 3 characters.
 *           - Email must be a valid email address.
 *           - Password must be a string with at least 6 characters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All fields are necessary (name, email, and password)!"
 *       500:
 *         description: Internal server error or "Secret key is not defined"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error registering user"
 */
