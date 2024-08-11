import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { swaggerDocs } from "./docs/swagger";
dotenv.config();
import express, { Request, Response } from "express";

// Routes import
import authRoutes from "./routes/authRoutes";
import usersRoutes from "./routes/usersRoutes";
import shortenUrlRoutes from "./routes/shortenUrl";

// Middleware import
// import authMiddleware from "./middleware/authMiddleware";

const app = express();
const port = 80;

app.use(express.json()); // Body parser

// Routes setup
app.use("/", shortenUrlRoutes);
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/api/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

export default app;
