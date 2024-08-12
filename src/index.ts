import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { swaggerDocs } from "./docs/swagger";
dotenv.config();
import express from "express";

// Routes import
import authRoutes from "./routes/authRoutes";
import usersRoutes from "./routes/usersRoutes";
import shortenUrlRoutes from "./routes/shortenUrl";

const app = express();
const port = 80;

app.use(express.json()); // Body parser

// Routes setup
app.use("/", shortenUrlRoutes);
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/doc/api", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

export default app;
