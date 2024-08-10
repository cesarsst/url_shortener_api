import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";

// Routes import
import authRoutes from "./routes/authRoutes";
import usersRoutes from "./routes/usersRoutes";

// Middleware import
import authMiddleware from "./middleware/authMiddleware";

const app = express();
const port = 3000;

app.use(express.json()); // Body parser

// Routes setup
app.use("/auth", authRoutes);
app.use("/users", authMiddleware, usersRoutes);

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

export default app;
